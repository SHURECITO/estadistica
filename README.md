# Proyecto Estadística - Calculadora Interactiva de Distribuciones Estadísticas

Aplicación interactiva fullstack construida con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** y **KaTeX**, lista para desplegarse en **Vercel**.

## 📊 Distribuciones Soportadas

1. **Normal y Normal Estándar ($Z$):** Parámetros $\mu$ y $\sigma$ con botón de acceso rápido para Normal Estándar ($\mu=0, \sigma=1$).
2. **t de Student:** Parámetro $\nu$ (grados de libertad) con colas ajustables.
3. **Chi-cuadrado ($\chi^2$):** Parámetro $\nu$ (grados de libertad).
4. **F de Fisher-Snedecor:** Parámetros $df_1$ (numerador) y $df_2$ (denominador).
5. **Gamma:** Parámetros de forma ($k$ o $\alpha$) y escala ($\theta$).
6. **Binomial:** Ensayos $n$ y probabilidad de éxito $p$.
7. **Poisson:** Tasa media de eventos $\lambda$.

---

## 🚀 Características Principales

* **Gráficos Interactivos SVG:**
  * Curvas suaves de densidad con sombreado dinámico de áreas bajo la curva.
  * Gráficos de barras para distribuciones discretas resaltando los valores seleccionados.
  * Marcadores verticales de corte en $x, x_1, x_2$.
  * Tooltip interactivo con coordenadas $(x, f(x))$ y masa puntual en tiempo real.
* **Modos de Cálculo:**
  * Cola izquierda: $P(X \le x)$
  * Cola derecha: $P(X \ge x)$
  * Intervalo central: $P(x_1 \le X \le x_2)$
  * Dos colas / Exteriores: $P(X < x_1 \cup X > x_2)$
  * Probabilidad puntual: $P(X = x)$ (discretas)
  * Modo inverso (Cuantiles): Encuentra el valor crítico $x^*$ dada la significancia o probabilidad acumulada $\alpha$.
* **Estadísticos en Vivo:**
  * Media ($\mu$), Varianza ($\sigma^2$), Desviación Estándar ($\sigma$), Asimetría ($\gamma_1$) y Exceso de Curtosis ($\gamma_2$).
* **Fórmulas con KaTeX:**
  * Desglose paso a paso con sustitución de variables en $\LaTeX$.
* **Tabla de Probabilidades Exportable:**
  * Vista tabular con exportación a archivo CSV.
* **Backend API REST en Vercel:**
  * Endpoint `POST /api/distribution` y `GET /api/distribution` que permite consumir los cálculos como servicio web.

---

## 🛠️ Ejecución Local

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilar para producción
npm run build
npm run start
```

Abre tu navegador en `http://localhost:3000`.

---

## 🌐 Despliegue en Vercel

### Opción 1: Conectar con GitHub (Recomendado)
1. Sube este repositorio a tu cuenta de GitHub.
2. Ingresa a [vercel.com](https://vercel.com) e importa el repositorio.
3. Vercel detectará automáticamente Next.js. Haz clic en **Deploy**.

### Opción 2: Vercel CLI
```bash
npx vercel
```
