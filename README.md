# ROCE · App de pedidos (app.roce.es)

PWA estática (HTML/CSS/JS, sin build) para pedir en ROCE Coffee, Bakery & Kitchen: **a mesa** (QR de cada mesa: `app.roce.es/mesa/<código>`) o **para recoger**.
Usa el mismo Supabase y el mismo Redsys que roce.es (repositorio `roce-restaurant`).

## Estado
Fase 1 · base: **la propia carta de roce.es/carta** (mismo diseño, filtros y Ayuda) con la parte de pedir encima (`order.js`/`order.css`): opciones y extras, carrito, modo Mesa / Recoger, horarios por categoría, instalable (manifest + service worker).
Pendiente: registro, cobro con Redsys, envío del pedido, pantalla de cocina y barra en el admin, sesión de mesa compartida, fidelización, Apple/Google Pay, integración con Ágora.

## Desarrollo local
```bash
python3 -m http.server 8422
```
Abrir `http://localhost:8422/?m=7` (simula el QR de la mesa 7).

## Carta
`menu.js`, `carta.js`, `carta.css`, `chef.js` e `i18n.js` son copias de `roce-restaurant` (`carta/*`, `i18n.js`). Si cambia la carta hay que actualizar las dos copias.

## Dominio
`CNAME` = `app.roce.es`. DNS: registro `CNAME` `app` → `gerardmarabella-source.github.io`.
