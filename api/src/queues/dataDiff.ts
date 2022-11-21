import dayjs from 'dayjs'
import miraiClient from '../db'

export async function dataDiffWorker() {
  // get all institutes with active status
  // check for students with active batch
  // check in last 24 hrs
  // check for data updated at and related documents
  // if some of them are not verified

  async function checkInstitute(cursor?: number) {
    const institutes = await miraiClient.institute.findMany({
      orderBy: { id: 'asc' },
      take: 25,
      ...(cursor !== undefined ? { cursor: { id: cursor }, skip: 1 } : {}),
      where: {
        students: {
          some: {
            AND: {
              // Batch: {
              //   status: 'ACTIVE',
              // },
              dataUpdatedAt: {
                gte: dayjs().subtract(1, 'D').toDate(),
              },
              OR: [
                {
                  score: {
                    verified: false,
                  },
                },
                {
                  education: {
                    some: {
                      verified: false,
                    },
                  },
                },
                {
                  experience: {
                    some: {
                      verified: false,
                    },
                  },
                },
                {
                  projects: {
                    some: {
                      verified: false,
                    },
                  },
                },
              ],
            },
          },
        },
      },
      select: {
        id: true,
        account: { select: { id: true } },
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    // institutes.forEach(async (institute) => {
    //   await addJob('NOTIFICATION', {
    //     ownerId: institute.account?.id as number,
    //     data: {
    //       sourceType: 'system',
    //       meta: {
    //         type: 'STUDENT_DATA_DIFF',
    //         studentCount: institute._count.students,
    //       },
    //     },
    //   })
    // })

    console.log(institutes)

    const nextCursor = institutes.at(-1)?.id

    // if there is more keep checking
    if (institutes.length === 25 && nextCursor !== undefined) {
      await checkInstitute(nextCursor)
    }
  }

  await checkInstitute()
}
