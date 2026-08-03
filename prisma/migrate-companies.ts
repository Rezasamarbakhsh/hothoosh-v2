import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

/**
 * Remove old companies that no longer exist in the new seed list.
 * Run this ONCE on the server after pulling the new seed-companies.ts
 */
async function main() {
  const NEW_SLUGS = new Set([
    'kourosh-dried-fruits',
    'kourosh-rice',
    'proshat-food',
    'golbarag-food',
    'hasti-arin',
    'tala-nab',
    'pakban-food',
    'kourosh-protein',
    'kourosh-fruit',
    'hatro-kourosh-dev',
  ]);

  const all = await db.company.findMany({ select: { id: true, name: true, slug: true } });
  const toDelete = all.filter((c) => !NEW_SLUGS.has(c.slug));

  if (toDelete.length === 0) {
    console.log('No old companies to remove.');
  } else {
    for (const c of toDelete) {
      // Move any users from this company to null
      await db.user.updateMany({ where: { companyId: c.id }, data: { companyId: null } });
      await db.company.delete({ where: { id: c.id } });
      console.log(`  ✗ Removed: ${c.name} (${c.slug})`);
    }
  }

  console.log(`\nRemoved ${toDelete.length} old company(ies).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
