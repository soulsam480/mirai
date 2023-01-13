import miraiClient from '../db'
import { logger } from '../lib'
import { addJob } from './boss'

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
              Batch: {
                status: 'ACTIVE',
              },
              dataUpdatedAt: {
                gt: new Date(new Date().getDate() - 1),
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

    logger.info('[MIRAI INFRA] Sending notification to ', institutes.length, ' institutes')

    for (const institute of institutes) {
      await addJob('NOTIFICATION', {
        ownerId: institute.account?.id as number,
        data: {
          sourceType: 'system',
          meta: {
            type: 'STUDENT_DATA_DIFF',
            studentCount: institute._count.students,
          },
        },
      })
    }

    const nextCursor = institutes.at(-1)?.id

    // if there is more keep checking
    if (institutes.length === 25 && nextCursor !== undefined) {
      await checkInstitute(nextCursor)
    }
  }

  await checkInstitute()
}
