export default class Subject {
    constructor() {
        this.observers = [];
    }

    // Observer registrieren
    addObserver(observer) {
        this.observers.push(observer);
    }

    // Observer entfernen
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    // Alle Observer benachrichtigen
    notify(eventType, data) {
        console.log(`📢 Notify-Event: "${eventType}" mit Daten:`, data);
        this.observers.forEach(observer => {
            if (typeof observer.update === "function") {
                observer.update(eventType, data);
            } else {
                console.error("⚠️ Fehler: Observer ohne update-Methode gefunden:", observer);
            }
        });
    }
}

