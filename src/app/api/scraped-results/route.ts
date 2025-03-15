// import { prisma } from "@/lib/prisma";

// export const saveScrapedResults = async (query: string, results: any) => {
//   await prisma.scrapedData.create({
//     data: {
//       query,
//       results: JSON.stringify(results),
//     },
//   });
// };

// export const getScrapedResults = async (query: string) => {
//   const data = await prisma.scrapedData.findUnique({
//     where: { query },
//   });
//   return data ? JSON.parse(data.results) : [];
// };
