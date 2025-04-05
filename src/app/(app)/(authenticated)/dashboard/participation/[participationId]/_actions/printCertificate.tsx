"use server";

import { getPayload } from "payload";
import configPromise from '@payload-config'
import { Course, Participation } from "@/payload-types";
import { getUser } from "@/app/(app)/(authenticated)/_actions/getUser";
import ejs from 'ejs'
import axios from "axios";

export default async function printCertificate(participationId: string) {
  const payload = await getPayload({ config: configPromise })
  const user = await getUser()

  // update the participation
  const participation: Participation = await payload.findByID({
    collection: 'participation',
    id: participationId,
    user,
    overrideAccess: false,
  })

  // check if participation exists
  if (!participation) {
    console.error('Participation not found')
    return null
  }

  // ensure course is of ts type Course
  const course = participation.course as Course

  // check if last module is a finish module
  if (course.curriculum[course.curriculum.length - 1].blockType !== 'finish') {
    console.error('Course has no certificate')
    return null
  }

  // check if progress is at last module
  if (participation.progress !== course.curriculum.length - 1) {
    console.error('Participation not completed')
    return null
  }

  // get the template
  let htmlTemplate: string;
  const lastModule = course.curriculum[course.curriculum.length - 1];
  if ('template' in lastModule) {
    htmlTemplate  = lastModule.template;
  } else {
    console.error('Template not found in the last module');
    return null;
  }

  // replace the placeholders in the template
  const html: string = await ejs.render(htmlTemplate, {
    name: user?.email,
    courseTitle: course.title,
    today: new Date(participation.updatedAt)
  });

  let printData = {
    landscape: false,
    html: html,
    format: 'A4',
    tailwind: true,
  }

  // generate the pdf
  let pdf;
  try {
    pdf = await axios({
      method: 'post',
      url: 'https://rapidapi.windypdf.com/convert',
      data: printData,
      headers: {
        'Content-Type': 'application/json',
        'api-secret': `${process.env.WINDYPDF_API_KEY}`,
      },
      responseType: 'stream',
    })
  } catch (error) {
    console.error('Error generating pdf:', error)
    return null
  }

  // Send PDF
  res.attachment(`Zertifikat.pdf`)

  pdf.data.pipe(res)
}