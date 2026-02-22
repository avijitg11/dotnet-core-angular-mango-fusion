import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  init(){
    const theme =  localStorage.getItem("theme")?? 'light';
    this.setTheme(theme as 'light' | 'dark')
    return theme;
  }

  setTheme(theme: 'light' | 'dark') {
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem("theme",theme);
  }

  toggleTheme() {
    const current = document.body.getAttribute('data-bs-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme as 'light' | 'dark');
    return newTheme;
  }
}