#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const envFiles = [
    { src: 'backend/student-service/.env.example', dst: 'backend/student-service/.env' },
    { src: 'backend/course-service/.env.example', dst: 'backend/course-service/.env' },
    { src: 'backend/api-gateway/.env.example', dst: 'backend/api-gateway/.env' },
    { src: 'frontend/.env.example', dst: 'frontend/.env' },
];

let copied = 0, skipped = 0;

for (const { src, dst } of envFiles) {
    const srcPath = path.join(ROOT, src);
    const dstPath = path.join(ROOT, dst);

    if (!fs.existsSync(srcPath)) {
        console.warn(`⚠️  No encontrado: ${src}`);
        continue;
    }

    if (fs.existsSync(dstPath)) {
        console.log(`⏩ Ya existe: ${dst}`);
        skipped++;
        continue;
    }

    fs.copyFileSync(srcPath, dstPath);
    console.log(`✅ Creado: ${dst}`);
    copied++;
}

console.log(`\n📋 Resultado: ${copied} creados, ${skipped} omitidos`);
if (copied > 0) {
    console.log('\n⚠️  IMPORTANTE: edita los .env y pon tu DB_PASSWORD\n');
}