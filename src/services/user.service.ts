import { prisma } from "../config/prisma";

export async function findOrCreateUser({
  email,
  name,
  provider,
}: {
  email: string;
  name: string;
  provider: string;
}) {
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, name },
    });
  }
  return user;
}
