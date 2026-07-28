import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Nova Admin...');

  // ─── Roles ───
  const roles = [
    { name: 'Super Admin', slug: 'super_admin', description: 'Full system access', priority: 100, isSystem: true },
    { name: 'Master', slug: 'master', description: 'Can manage agents and clients', priority: 80, isSystem: true },
    { name: 'Agent', slug: 'agent', description: 'Can manage clients', priority: 50, isSystem: true },
    { name: 'Client', slug: 'client', description: 'End user who places bets', priority: 10, isSystem: true },
  ];

  const createdRoles: Record<string, any> = {};
  for (const r of roles) {
    createdRoles[r.slug] = await prisma.role.upsert({
      where: { slug: r.slug },
      update: r,
      create: r,
    });
  }
  console.log(`✅ ${roles.length} roles created`);

  // ─── Permissions ───
  const permissions = [
    // Dashboard
    { name: 'dashboard.view', module: 'dashboard', action: 'view', description: 'View dashboard' },
    // Users
    { name: 'users.create', module: 'users', action: 'create', description: 'Create users' },
    { name: 'users.read', module: 'users', action: 'read', description: 'View users' },
    { name: 'users.update', module: 'users', action: 'update', description: 'Update users' },
    { name: 'users.delete', module: 'users', action: 'delete', description: 'Delete users' },
    // Events
    { name: 'events.create', module: 'events', action: 'create', description: 'Create events' },
    { name: 'events.read', module: 'events', action: 'read', description: 'View events' },
    { name: 'events.update', module: 'events', action: 'update', description: 'Update events' },
    { name: 'events.settle', module: 'events', action: 'settle', description: 'Settle events' },
    // Bets
    { name: 'bets.read', module: 'bets', action: 'read', description: 'View bets' },
    { name: 'bets.settle', module: 'bets', action: 'settle', description: 'Settle bets' },
    // Wallet
    { name: 'wallet.read', module: 'wallet', action: 'read', description: 'View wallets' },
    { name: 'wallet.credit', module: 'wallet', action: 'credit', description: 'Add credit' },
    { name: 'wallet.debit', module: 'wallet', action: 'debit', description: 'Deduct credit' },
    // Reports
    { name: 'reports.view', module: 'reports', action: 'view', description: 'View reports' },
    // Settings
    { name: 'settings.read', module: 'settings', action: 'read', description: 'View settings' },
    { name: 'settings.update', module: 'settings', action: 'update', description: 'Update settings' },
    // Roles
    { name: 'roles.create', module: 'roles', action: 'create', description: 'Create roles' },
    { name: 'roles.read', module: 'roles', action: 'read', description: 'View roles' },
    { name: 'roles.update', module: 'roles', action: 'update', description: 'Update roles' },
    // Audit
    { name: 'audit.read', module: 'audit', action: 'read', description: 'View audit logs' },
  ];

  const createdPermissions: Record<string, any> = {};
  for (const p of permissions) {
    createdPermissions[p.name] = await prisma.permission.upsert({
      where: { name: p.name },
      update: p,
      create: p,
    });
  }
  console.log(`✅ ${permissions.length} permissions created`);

  // ─── Role-Permission Assignments ───
  const superAdminPerms = permissions.map(p => p.name);
  const masterPerms = ['dashboard.view', 'users.create', 'users.read', 'users.update',
    'events.read', 'bets.read', 'wallet.read', 'wallet.credit', 'reports.view'];
  const agentPerms = ['dashboard.view', 'users.read', 'events.read', 'bets.read', 'wallet.read', 'reports.view'];
  const clientPerms = ['events.read', 'bets.read'];

  const rolePerms: Record<string, string[]> = {
    super_admin: superAdminPerms,
    master: masterPerms,
    agent: agentPerms,
    client: clientPerms,
  };

  for (const [slug, permNames] of Object.entries(rolePerms)) {
    const role = createdRoles[slug];
    for (const permName of permNames) {
      const perm = createdPermissions[permName];
      if (perm) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
          update: {},
          create: { roleId: role.id, permissionId: perm.id },
        });
      }
    }
  }
  console.log(`✅ Role-permission assignments done`);

  // ─── Super Admin User ───
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPassword,
      displayName: 'Super Admin',
      roleId: createdRoles.super_admin.id,
      isActive: true,
      isVerified: true,
      balance: 999999,
      exposureLimit: 999999,
    },
  });
  console.log(`✅ Super Admin created: admin / admin123`);

  // ─── Demo Master ───
  const masterPassword = await bcrypt.hash('master123', 10);
  await prisma.user.upsert({
    where: { username: 'master' },
    update: {},
    create: {
      username: 'master',
      passwordHash: masterPassword,
      displayName: 'Demo Master',
      roleId: createdRoles.master.id,
      isActive: true,
      balance: 500000,
      exposureLimit: 500000,
    },
  });
  console.log(`✅ Demo Master created: master / master123`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
