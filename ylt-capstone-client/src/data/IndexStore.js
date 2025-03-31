import { makeAutoObservable } from "mobx";

class IndexStore {
  currentIndex = 0;
  currentText = '';
  started = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIndex(index) {
    this.currentIndex = index;
  }

  setCurrentText(currentText) {
    this.currentText = currentText;
  }

  setStarted(started) {
    this.started = started;
  }

}

export const indexStore = new IndexStore();