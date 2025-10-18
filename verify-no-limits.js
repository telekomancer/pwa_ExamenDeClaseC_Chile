// Script para verificar que no hay límites diarios
console.log('🔍 Verificando restricciones diarias...');

// Verificar localStorage
const progress = JSON.parse(localStorage.getItem('clase-c-progress') || '{}');
console.log('📊 Progreso actual:', progress);

// Verificar si hay alguna restricción
const hasDailyLimit = progress.dailyLimit || false;
const maxSessionsPerDay = progress.maxSessionsPerDay || null;

console.log('🚫 Límite diario:', hasDailyLimit);
console.log('📈 Máximo de sesiones por día:', maxSessionsPerDay);

// Verificar sesiones de hoy
const today = new Date().toDateString();
const todaySessions = progress.completedSessions?.filter(s => s.date === today) || [];
console.log('📅 Sesiones de hoy:', todaySessions.length);

// Limpiar cualquier restricción si existe
if (hasDailyLimit || maxSessionsPerDay) {
    console.log('🧹 Eliminando restricciones...');
    delete progress.dailyLimit;
    delete progress.maxSessionsPerDay;
    localStorage.setItem('clase-c-progress', JSON.stringify(progress));
    console.log('✅ Restricciones eliminadas');
}

console.log('✅ Verificación completada - No hay límites diarios');
