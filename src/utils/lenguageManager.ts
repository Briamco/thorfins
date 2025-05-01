export function setFinanceLang(lang: string) {
  localStorage.setItem('financeLang', lang)
  window.dispatchEvent(new Event('financeLangChanged'))
}