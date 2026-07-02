#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const required = [
    'backend/student-service/.env',
    'backend/course-service/.env',
    'backend/api-gateway/.env',
    'frontend/.env',
];

const missing = required.filter(f => !fs.existsSync(path.join(ROOT, f)));

if (missing.length > 0) {
    console.log('\n⚠️  Archivos .env faltantes en:');
    missing.forEach(f => console.log(`   → ${f}`));
    console.log('\n▶  Ejecuta: npm run setup:envs\n');
}