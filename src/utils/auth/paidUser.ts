export async function paidUser({user, payload, id}: {user: any, payload: any, id: string}) {
  if(user?.collection === "users"){
    return true;
  } else {
    // check if user has a participation for the course
    const participation = await payload.find({
      collection: 'participation',
      where: {
        customer: { equals: user?.id },
        course: { equals: id },
        paid: { equals: true }
      }
    })
    return participation.docs.length > 0;
  }
}