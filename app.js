// PWA Clase C Chile - Aplicación Principal
class ClaseCApp {
  constructor() {
    this.questions = [];
    this.currentSession = null;
    this.userProgress = this.loadUserProgress();
    this.currentQuestionIndex = 0;
    this.sessionAnswers = [];
    this.sessionStartTime = null;
    this.timerInterval = null;
    this.selectedQuestionsCount = 20; // Cantidad por defecto
    
    this.init();
  }

  async init() {
    try {
      this.showLoading('Inicializando aplicación...');
      
      await this.loadQuestions();
      this.showLoading('Registrando Service Worker...');
      
      await this.registerServiceWorker();
      this.showLoading('Configurando interfaz...');
      
      this.setupEventListeners();
      this.updateWelcomeScreen();
      this.requestNotificationPermission();
      
      this.hideLoading();
      console.log('✅ Aplicación inicializada correctamente');
      
    } catch (error) {
      console.error('❌ Error inicializando la aplicación:', error);
      this.showError(`Error cargando la aplicación: ${error.message}`);
    }
  }

  async loadQuestions() {
    try {
      console.log('🔄 Cargando preguntas...');
      
      // Timeout de 10 segundos para evitar cargas infinitas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('./questions.json', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Formato de questions.json inválido');
      }
      
      this.questions = data.questions;
      console.log(`✅ Cargadas ${this.questions.length} preguntas`);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('❌ Timeout cargando preguntas');
        this.showError('Timeout: La carga de preguntas tardó demasiado. Verifica tu conexión.');
      } else {
        console.error('❌ Error cargando preguntas:', error);
        this.showError(`Error cargando preguntas: ${error.message}`);
      }
      throw error;
    }
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('sw.js');
        console.log('Service Worker registrado:', registration);
        
        // Escuchar actualizaciones del Service Worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.error('Error registrando Service Worker:', error);
      }
    }
  }

  setupEventListeners() {
    // Botones principales
    document.getElementById('start-study').addEventListener('click', () => this.startNewSession());
    document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
    document.getElementById('start-new-session').addEventListener('click', () => this.startNewSession());
    document.getElementById('new-session-from-review').addEventListener('click', () => this.startNewSession());
    document.getElementById('review-answers').addEventListener('click', () => this.showReview());
    document.getElementById('back-to-results').addEventListener('click', () => this.showResults());

    // Selector de cantidad de preguntas
    this.setupQuestionSelector();

    // Detectar cuando la app vuelve a estar activa
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.currentSession) {
        this.updateTimer();
      }
    });
  }

  setupQuestionSelector() {
    // Botones de opciones predefinidas
    document.querySelectorAll('.question-option').forEach(button => {
      button.addEventListener('click', () => {
        // Remover clase active de todos los botones
        document.querySelectorAll('.question-option').forEach(btn => btn.classList.remove('active'));
        // Agregar clase active al botón clickeado
        button.classList.add('active');
        
        const count = parseInt(button.dataset.questions);
        this.selectedQuestionsCount = count;
        this.updateSelectedCount();
        
        // Limpiar input personalizado
        document.getElementById('custom-questions').value = '';
      });
    });

    // Input personalizado
    const customInput = document.getElementById('custom-questions');
    customInput.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      if (value && value > 0 && value <= 100) {
        // Remover clase active de botones predefinidos
        document.querySelectorAll('.question-option').forEach(btn => btn.classList.remove('active'));
        
        this.selectedQuestionsCount = value;
        this.updateSelectedCount();
      }
    });

    // Cargar preferencia guardada
    this.loadPreferredQuestionsCount();
  }

  loadPreferredQuestionsCount() {
    const preferred = this.userProgress.preferredQuestionsCount || 20;
    this.selectedQuestionsCount = preferred;
    
    // Marcar el botón correspondiente como activo
    const button = document.querySelector(`[data-questions="${preferred}"]`);
    if (button) {
      document.querySelectorAll('.question-option').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    } else {
      // Si no hay botón predefinido, usar input personalizado
      document.getElementById('custom-questions').value = preferred;
    }
    
    this.updateSelectedCount();
  }

  updateSelectedCount() {
    document.getElementById('selected-count').textContent = this.selectedQuestionsCount;
    
    // Guardar preferencia
    this.userProgress.preferredQuestionsCount = this.selectedQuestionsCount;
    this.saveUserProgress();
  }

  loadUserProgress() {
    try {
      const saved = localStorage.getItem('clase-c-progress');
      const defaultProgress = {
        totalDaysStudied: 0,
        totalQuestionsAnswered: 0,
        lastStudyDate: null,
        streak: 0,
        completedSessions: [],
        preferredQuestionsCount: 20 // Preferencia guardada
      };
      return saved ? JSON.parse(saved) : defaultProgress;
    } catch (error) {
      console.error('Error cargando progreso:', error);
      return {
        totalDaysStudied: 0,
        totalQuestionsAnswered: 0,
        lastStudyDate: null,
        streak: 0,
        completedSessions: [],
        preferredQuestionsCount: 20
      };
    }
  }

  saveUserProgress() {
    try {
      localStorage.setItem('clase-c-progress', JSON.stringify(this.userProgress));
    } catch (error) {
      console.error('Error guardando progreso:', error);
    }
  }

  updateWelcomeScreen() {
    const daysStudied = document.getElementById('days-studied');
    const totalQuestions = document.getElementById('total-questions');
    const currentStreak = document.getElementById('current-streak');
    const totalAvailableQuestions = document.getElementById('total-available-questions');
    
    daysStudied.textContent = this.userProgress.totalDaysStudied;
    totalQuestions.textContent = this.userProgress.totalQuestionsAnswered;
    currentStreak.textContent = this.userProgress.streak;
    
    // Actualizar el total de preguntas disponibles
    if (totalAvailableQuestions) {
      totalAvailableQuestions.textContent = this.questions.length;
    }

    // Mostrar información sobre sesiones de hoy
    this.updateTodaySessionInfo();
  }

  updateTodaySessionInfo() {
    const today = new Date().toDateString();
    const todaySessions = this.userProgress.completedSessions.filter(s => s.date === today);
    const startButton = document.getElementById('start-study');
    const todaySessionsDiv = document.getElementById('today-sessions');
    const sessionsList = document.getElementById('sessions-list');
    
    if (todaySessions.length > 0) {
      const totalTodayQuestions = todaySessions.reduce((sum, session) => sum + session.totalQuestions, 0);
      const totalTodayCorrect = todaySessions.reduce((sum, session) => sum + session.correctAnswers, 0);
      
      startButton.textContent = `Nueva Sesión (${todaySessions.length} completada${todaySessions.length > 1 ? 's' : ''})`;
      startButton.classList.add('btn-continue');
      
      // Mostrar estadísticas del día
      const studyInfo = document.getElementById('selected-questions-info');
      studyInfo.innerHTML = `
        <p>Estudiarás <span id="selected-count">${this.selectedQuestionsCount}</span> preguntas en esta sesión</p>
        <div class="today-stats">
          <small>Hoy: ${totalTodayQuestions} preguntas respondidas, ${totalTodayCorrect} correctas</small>
        </div>
      `;
      
      // Mostrar historial de sesiones del día
      todaySessionsDiv.style.display = 'block';
      sessionsList.innerHTML = '';
      
      todaySessions.reverse().forEach((session, index) => {
        const sessionTime = new Date(session.timestamp).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        });
        const accuracy = Math.round((session.correctAnswers / session.totalQuestions) * 100);
        
        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        sessionItem.innerHTML = `
          <div class="session-time">${sessionTime}</div>
          <div class="session-stats">
            ${session.correctAnswers}/${session.totalQuestions} correctas
            <span class="session-accuracy">(${accuracy}%)</span>
          </div>
        `;
        sessionsList.appendChild(sessionItem);
      });
    } else {
      startButton.textContent = 'Comenzar Estudio de Hoy';
      startButton.classList.remove('btn-continue');
      todaySessionsDiv.style.display = 'none';
    }
  }

  startNewSession() {
    // Seleccionar preguntas para la nueva sesión
    const sessionQuestions = this.selectDailyQuestions();
    this.currentSession = {
      questions: sessionQuestions,
      startTime: new Date(),
      answers: [],
      currentIndex: 0,
      sessionId: Date.now() // ID único para esta sesión
    };
    
    this.currentQuestionIndex = 0;
    this.sessionAnswers = [];
    this.sessionStartTime = new Date();
    
    this.showScreen('question-screen');
    this.showQuestion();
    this.startTimer();
  }

  selectDailyQuestions() {
    // Usar timestamp actual para mayor variedad en múltiples sesiones
    const now = new Date();
    const seed = now.getTime(); // Usar timestamp para variedad
    
    // Crear una copia de las preguntas y mezclar usando la semilla
    const shuffled = [...this.questions];
    this.shuffleArray(shuffled, seed);
    
    // Seleccionar la cantidad elegida por el usuario
    const count = Math.min(this.selectedQuestionsCount, this.questions.length);
    return shuffled.slice(0, count);
  }

  shuffleArray(array, seed) {
    // Algoritmo de mezcla determinístico basado en semilla
    let currentIndex = array.length;
    let random;
    
    while (currentIndex !== 0) {
      // Generar número pseudoaleatorio basado en semilla
      seed = (seed * 9301 + 49297) % 233280;
      random = Math.floor(seed / 233280 * currentIndex);
      currentIndex--;
      
      [array[currentIndex], array[random]] = [array[random], array[currentIndex]];
    }
  }

  showQuestion() {
    const question = this.currentSession.questions[this.currentQuestionIndex];
    const questionNumber = this.currentQuestionIndex + 1;
    const totalQuestions = this.currentSession.questions.length;
    
    // Actualizar información de la pregunta
    document.getElementById('question-number').textContent = `${questionNumber} / ${totalQuestions}`;
    document.getElementById('question-text').textContent = question.question;
    
    // Mostrar imagen si está disponible
    if (question.image) {
      const questionImage = document.getElementById('question-image');
      const questionImg = document.getElementById('question-img');
      questionImg.src = question.image;
      questionImage.style.display = 'block';
    } else {
      document.getElementById('question-image').style.display = 'none';
    }
    
    // Limpiar opciones anteriores
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    // Crear opciones
    question.options.forEach((option, index) => {
      const optionElement = document.createElement('button');
      optionElement.className = 'option';
      optionElement.textContent = option;
      optionElement.addEventListener('click', () => this.selectAnswer(index));
      optionsContainer.appendChild(optionElement);
    });
    
    // Resetear botón siguiente
    const nextButton = document.getElementById('next-question');
    nextButton.disabled = true;
    nextButton.textContent = 'Siguiente';
  }

  selectAnswer(selectedIndex) {
    const question = this.currentSession.questions[this.currentQuestionIndex];
    
    // Guardar respuesta
    this.sessionAnswers.push({
      questionId: question.id,
      selectedAnswer: selectedIndex,
      correctAnswer: question.correct,
      isCorrect: selectedIndex === question.correct,
      timeSpent: this.getTimeSpent()
    });
    
    // Mostrar retroalimentación visual
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
      option.disabled = true;
      if (index === question.correct) {
        option.classList.add('correct');
      } else if (index === selectedIndex && selectedIndex !== question.correct) {
        option.classList.add('incorrect');
      }
    });
    
    // Habilitar botón siguiente
    const nextButton = document.getElementById('next-question');
    nextButton.disabled = false;
    
    // Mostrar explicación si está disponible
    if (question.explanation) {
      this.showExplanation(question.explanation);
    }
  }

  showExplanation(explanation) {
    // Crear elemento de explicación
    const explanationElement = document.createElement('div');
    explanationElement.className = 'explanation';
    explanationElement.innerHTML = `
      <div class="explanation-content">
        <h4>💡 Explicación:</h4>
        <p>${explanation}</p>
      </div>
    `;
    
    // Insertar después de las opciones
    const optionsContainer = document.getElementById('options');
    optionsContainer.appendChild(explanationElement);
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex < this.currentSession.questions.length) {
      this.showQuestion();
    } else {
      this.completeSession();
    }
  }

  completeSession() {
    this.stopTimer();
    
    // Calcular estadísticas
    const correctAnswers = this.sessionAnswers.filter(a => a.isCorrect).length;
    const incorrectAnswers = this.sessionAnswers.length - correctAnswers;
    const accuracy = Math.round((correctAnswers / this.sessionAnswers.length) * 100);
    
    // Actualizar progreso del usuario
    this.updateUserProgress(correctAnswers);
    
    // Mostrar resultados
    this.showResults(correctAnswers, incorrectAnswers, accuracy);
  }

  updateUserProgress(correctAnswers) {
    const today = new Date().toDateString();
    const isNewDay = this.userProgress.lastStudyDate !== today;
    
    if (isNewDay) {
      this.userProgress.totalDaysStudied++;
      this.userProgress.streak++;
      this.userProgress.lastStudyDate = today;
    }
    
    this.userProgress.totalQuestionsAnswered += this.sessionAnswers.length;
    
    // Guardar sesión completada con ID único
    this.userProgress.completedSessions.push({
      sessionId: this.currentSession.sessionId,
      date: today,
      correctAnswers,
      totalQuestions: this.sessionAnswers.length,
      completed: true,
      timestamp: new Date().toISOString(),
      duration: this.getTimeSpent()
    });
    
    this.saveUserProgress();
  }

  showResults(correctAnswers, incorrectAnswers, accuracy) {
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('incorrect-answers').textContent = incorrectAnswers;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
    
    this.showScreen('results-screen');
  }

  showReview() {
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    
    this.sessionAnswers.forEach((answer, index) => {
      const question = this.currentSession.questions[index];
      const reviewItem = document.createElement('div');
      reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
      
      reviewItem.innerHTML = `
        <div class="review-question">
          <h4>Pregunta ${index + 1}</h4>
          <p>${question.question}</p>
        </div>
        <div class="review-answers">
          <div class="user-answer ${answer.isCorrect ? 'correct' : 'incorrect'}">
            <strong>Tu respuesta:</strong> ${question.options[answer.selectedAnswer]}
          </div>
          ${!answer.isCorrect ? `
            <div class="correct-answer">
              <strong>Respuesta correcta:</strong> ${question.options[question.correct]}
            </div>
          ` : ''}
          ${question.explanation ? `
            <div class="explanation">
              <strong>Explicación:</strong> ${question.explanation}
            </div>
          ` : ''}
        </div>
      `;
      
      reviewList.appendChild(reviewItem);
    });
    
    this.showScreen('review-screen');
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimer() {
    if (this.sessionStartTime) {
      const elapsed = Math.floor((new Date() - this.sessionStartTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      document.getElementById('question-timer').textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  getTimeSpent() {
    if (this.sessionStartTime) {
      return Math.floor((new Date() - this.sessionStartTime) / 1000);
    }
    return 0;
  }

  showScreen(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Mostrar la pantalla seleccionada
    document.getElementById(screenId).classList.add('active');
  }

  showMessage(message) {
    // Crear modal de mensaje
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>${message}</h3>
        <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">Entendido</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (modal.parentElement) {
        modal.remove();
      }
    }, 5000);
  }

  showError(message) {
    const errorModal = document.createElement('div');
    errorModal.className = 'modal error-modal';
    errorModal.innerHTML = `
      <div class="modal-content">
        <h3>❌ Error</h3>
        <p>${message}</p>
        <button onclick="location.reload()" class="btn btn-primary">Reintentar</button>
      </div>
    `;
    
    document.body.appendChild(errorModal);
  }

  hideLoading() {
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    
    if (progressText) {
      progressText.textContent = '¡Listo para estudiar!';
    }
    
    if (progressFill) {
      progressFill.style.width = '100%';
    }
  }

  showLoading(message = 'Cargando...') {
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    
    if (progressText) {
      progressText.textContent = message;
    }
    
    if (progressFill) {
      progressFill.style.width = '50%';
    }
  }

  showUpdateNotification() {
    const updateModal = document.createElement('div');
    updateModal.className = 'modal update-modal';
    updateModal.innerHTML = `
      <div class="modal-content">
        <h3>🔄 Actualización Disponible</h3>
        <p>Hay una nueva versión de la aplicación disponible.</p>
        <div class="modal-actions">
          <button onclick="location.reload()" class="btn btn-primary">Actualizar</button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn btn-secondary">Más tarde</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(updateModal);
  }

  async requestNotificationPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Permisos de notificación concedidos');
          this.scheduleDailyNotification();
          this.setupNotificationTriggers();
        } else if (permission === 'denied') {
          console.log('Permisos de notificación denegados');
        }
      } catch (error) {
        console.error('Error solicitando permisos de notificación:', error);
      }
    }
  }

  scheduleDailyNotification() {
    // Programar notificación para las 9:00 AM todos los días
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Esta funcionalidad se implementaría con un backend para notificaciones push
      // Por ahora, solo registramos que el usuario aceptó las notificaciones
      console.log('Notificaciones programadas para recordatorios diarios');
    }
  }

  setupNotificationTriggers() {
    // Verificar si el usuario no ha estudiado hoy
    const today = new Date().toDateString();
    const lastStudyDate = this.userProgress.lastStudyDate;
    
    if (lastStudyDate !== today) {
      // Mostrar notificación local si no ha estudiado hoy
      this.showLocalNotification();
    }
  }

  showLocalNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('🚗 ¡Es hora de estudiar!', {
        body: 'Tienes 20 preguntas esperándote para tu estudio diario de Clase C',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'daily-study-reminder',
        requireInteraction: true,
        actions: [
          {
            action: 'open',
            title: 'Abrir App',
            icon: '/icons/icon-72x72.png'
          }
        ]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-cerrar después de 10 segundos
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.claseCApp = new ClaseCApp();
});

// Manejar instalación de PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Mostrar botón de instalación
  const installButton = document.createElement('button');
  installButton.textContent = '📱 Instalar App';
  installButton.className = 'btn btn-primary install-btn';
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Instalación ${outcome}`);
      deferredPrompt = null;
      installButton.remove();
    }
  });
  
  document.querySelector('.welcome-card').appendChild(installButton);
});

// Manejar cuando la app se instala
window.addEventListener('appinstalled', () => {
  console.log('PWA instalada exitosamente');
  document.querySelector('.install-btn')?.remove();
});
