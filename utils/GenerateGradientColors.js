/**
 * Génère un dégradé entre deux couleurs (sans librairie externe)
 * @param {string} startColor - Couleur de départ (ex: "#ff0000")
 * @param {string} endColor - Couleur de fin (ex: "#0000ff")
 * @param {number} steps - Nombre de couleurs à générer
 * @returns {string[]} Tableau de couleurs hexadécimales
 */
export const GenerateGradientColors = (startColor, endColor, steps) => {
  // Supprimer le # si présent
  const start = startColor.replace("#", "");
  const end = endColor.replace("#", "");

  // Convertir hex -> RGB
  const startR = parseInt(start.substring(0, 2), 16);
  const startG = parseInt(start.substring(2, 4), 16);
  const startB = parseInt(start.substring(4, 6), 16);

  const endR = parseInt(end.substring(0, 2), 16);
  const endG = parseInt(end.substring(2, 4), 16);
  const endB = parseInt(end.substring(4, 6), 16);

  const colors = [];

  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(startR + ratio * (endR - startR));
    const g = Math.round(startG + ratio * (endG - startG));
    const b = Math.round(startB + ratio * (endB - startB));

    const hex = `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    colors.push(hex);
  }

  return colors;
};
