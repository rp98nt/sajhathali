// Script to create initial SUPERADMIN user
const fs = require('fs');
const path = require('path');

function loadEnvFromFile(relativePath) {
  const full = path.join(__dirname, '..', relativePath);
  if (!fs.existsSync(full)) return;
  const text = fs.readFileSync(full, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFromFile('.env.local');
loadEnvFromFile('.env');

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const adminEmail =
  process.env.SUPERADMIN_EMAIL?.trim() || 'admin@example.com';

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

async function createSuperAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' }
    });

    if (existingAdmin) {
      console.log('SUPERADMIN already exists:', existingAdmin.email);
      const hashedPassword = await hashPassword('admin123');
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          email: adminEmail,
          password: hashedPassword
        }
      });
      console.log('Email updated to:', adminEmail);
      console.log('Password reset to: admin123');
      return;
    }

    const hashedPassword = await hashPassword('admin123');

    const superAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPERADMIN',
        status: 'APPROVED',
        approvedAt: new Date()
      }
    });

    console.log('SUPERADMIN created successfully:');
    console.log('Email:', superAdmin.email);
    console.log('Password: admin123');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
  } catch (error) {
    console.error('Error creating SUPERADMIN:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
