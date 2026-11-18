/* ROCE · Carta digital (se abre solo con el QR de las mesas; no hay ningún enlace desde roce.es).
   Todo el contenido está aquí: para cambiar un plato o un precio se edita este archivo.
   Alérgenos: números oficiales de la carta (1 Gluten … 14 Moluscos). `img` (opcional) = foto del plato, p. ej. "/carta/img/001.jpg". */
window.CARTA = {
  allergens: [
    { n: 1, es: 'Gluten', en: 'Gluten' }, { n: 2, es: 'Crustáceos', en: 'Crustaceans' }, { n: 3, es: 'Huevo', en: 'Egg' },
    { n: 4, es: 'Pescado', en: 'Fish' }, { n: 5, es: 'Cacahuete', en: 'Peanuts' }, { n: 6, es: 'Soja', en: 'Soy' },
    { n: 7, es: 'Leche', en: 'Milk' }, { n: 8, es: 'Frutos de cáscara', en: 'Tree nuts' }, { n: 9, es: 'Apio', en: 'Celery' },
    { n: 10, es: 'Mostaza', en: 'Mustard' }, { n: 11, es: 'Sésamo', en: 'Sesame' }, { n: 12, es: 'Sulfitos', en: 'Sulphites' },
    { n: 13, es: 'Altramuces', en: 'Lupin' }, { n: 14, es: 'Moluscos', en: 'Molluscs' }
  ],
  sections: [
    {
      id: 'kitchen', color: 'kraft', title: { es: 'Kitchen', en: 'Kitchen' },
      groups: [
        {
          title: { es: 'Kitchen', en: 'Kitchen' }, force: true,
          blocks: [
            {
              title: { es: 'Tostadas', en: 'Toasts' }, note: { es: 'Pan de masa madre', en: 'Sourdough bread' },
              items: [
                { code: '000', name: '000', img: '/assets/dishes/tostada-000.webp', al: [1], nut: [328, 8, 54, 10], price: 3.9, es: 'Pan de masa madre, tomate de rama triturado y AOVE.', en: 'Sourdough, grated vine tomato and extra virgin olive oil.' },
                { code: '001', name: '001', img: '/assets/dishes/tostada-001.webp', al: [1, 11], nut: [482, 12, 49, 24], price: 7.5, es: 'Pan de masa madre, guacamole, pepino, rabanito y semillas.', en: 'Sourdough, guacamole, cucumber, radish and seeds.' },
                { code: '002', name: '002', img: '/assets/dishes/tostada-002.webp', al: [1, 3, 7], nut: [590, 22, 52, 30], price: 10.5, es: 'Pan de masa madre, manzana confitada, huevos pochados, holandesa de AOVE y rúcula.', en: 'Sourdough, candied apple, poached eggs, olive-oil hollandaise and rocket.' },
                { code: '003', name: '003', img: '/assets/dishes/tostada-003.webp', al: [1, 3, 4, 7], nut: [612, 34, 48, 28], price: 12.5, es: 'Pan de masa madre, salmón ahumado, queso cottage, huevo poché, eneldo y limón.', en: 'Sourdough, smoked salmon, cottage cheese, poached egg, dill and lemon.' },
                { code: '004', name: '004', img: '/assets/dishes/tostada-004.webp', al: [1, 4], nut: [496, 31, 45, 18], price: 10.5, es: 'Pan de masa madre, pimiento y berenjena asados, ventresca de atún, cebolla y AOVE.', en: 'Sourdough, roasted pepper and aubergine, tuna belly, onion and olive oil.' },
                { code: '005', name: '005', img: '/assets/dishes/tostada-005.webp', al: [1, 11], nut: [436, 14, 55, 16], price: 6.5, es: 'Pan de masa madre, hummus de remolacha, berenjena asada, rúcula y semillas.', en: 'Sourdough, beetroot hummus, roasted aubergine, rocket and seeds.' },
                { code: '006', name: '006', img: '/assets/dishes/tostada-006.webp', al: [1, 3], nut: [520, 20, 60, 22], price: 7.5, es: 'Pan artesano con mermelada y 2 huevos a elegir (revueltos, pochados o fritos).', en: 'Artisan bread with jam and 2 eggs your way (scrambled, poached or fried).' }
              ],
              extras: { title: { es: 'Extras para tostadas', en: 'Toast extras' }, list: [[{ es: 'Bacon', en: 'Bacon' }, 2.5, '/assets/dishes/bacon.webp'], [{ es: 'Aguacate', en: 'Avocado' }, 2.5, '/assets/dishes/aguacate.webp'], [{ es: 'Salmón', en: 'Salmon' }, 3.5, '/assets/dishes/salmon-ahumado.webp'], [{ es: 'Huevo', en: 'Egg' }, 2, '/assets/dishes/huevo.webp'], [{ es: 'Jamón', en: 'Ham' }, 3, '/assets/dishes/jamon.webp']] }
            },
            {
              title: { es: 'Açaí & Yogur', en: 'Açaí & Yogurt' }, note: { es: 'Todo el día', en: 'All day' },
              items: [
                { name: 'Dark Açaí', img: '/assets/dishes/dark-acai.webp', diet: ['veg', 'pesc', 'vegan', 'gf', 'lf'], al: [5, 8], nut: [412, 10, 56, 16], price: 10.5, es: 'Açaí, plátano, granola, crema de cacahuete y nibs de cacao.', en: 'Açaí, banana, granola, peanut cream and cacao nibs.' },
                { name: 'Shaka Açaí', img: '/assets/dishes/shaka-acai.webp', diet: ['veg', 'pesc', 'vegan', 'gf', 'lf'], al: [8], nut: [398, 8, 62, 14], price: 10.5, es: 'Açaí, mango, plátano, coco y granola.', en: 'Açaí, mango, banana, coconut and granola.' },
                { name: 'Greek Freak', img: '/assets/dishes/greek-freak.webp', al: [7, 8], nut: [368, 16, 48, 12], price: 7.5, es: 'Yogur griego, fruta de temporada, granola y miel.', en: 'Greek yogurt, seasonal fruit, granola and honey.' }
              ],
              extras: { title: { es: 'Extras', en: 'Extras' }, list: [[{ es: 'Fruta', en: 'Fruit' }, 2, '/assets/dishes/fruta.webp'], [{ es: 'Granola', en: 'Granola' }, 1.5, '/assets/dishes/granola.webp'], [{ es: 'Crema de cacahuete', en: 'Peanut cream' }, 1.5, '/assets/dishes/crema-cacahuete.webp']] }
            },
            {
              title: { es: 'Sándwiches', en: 'Sandwiches' }, note: { es: 'Todo el día', en: 'All day' },
              items: [
                { name: 'Chicken Joe', img: '/assets/dishes/chicken-joe.webp', al: [1, 3], nut: [632, 38, 49, 28], price: 12.5, es: 'Pollo a la brasa, bacon, tomate, hojas verdes y mayonesa de ajo asado.', en: 'Grilled chicken, bacon, tomato, green leaves and roasted garlic mayo.' },
                { name: 'Terra', img: '/assets/dishes/terra.webp', diet: ['veg', 'pesc', 'lf'], al: [1, 11], nut: [460, 18, 52, 20], price: 10.5, es: 'Hummus de remolacha, berenjena y calabacín asados, tomate seco, rúcula, tomate, hojas verdes y aliño de limón.', en: 'Beetroot hummus, roasted aubergine and courgette, sun-dried tomato, rocket, tomato, green leaves and lemon dressing.' },
                { name: 'New York 1888', img: '/assets/dishes/new-york-1888.webp', al: [1, 7, 10], nut: [712, 36, 54, 38], price: 13.5, es: 'Pastrami, queso suizo, pepinillos, mostaza ROCE y rúcula.', en: 'Pastrami, Swiss cheese, pickles, ROCE mustard and rocket.' },
                { name: 'Liguria', img: '/assets/dishes/liguria.webp', al: [1, 7, 8], nut: [676, 40, 50, 36], price: 13.5, es: 'Pollo a la brasa, pesto verde, queso cheddar y queso Edam, rúcula.', en: 'Grilled chicken, green pesto, cheddar and Edam cheese, rocket.' }
              ]
            }
          ]
        },
        {
          title: { es: 'Comidas', en: 'Lunch' },
          blocks: [
            {
              title: { es: 'Starters', en: 'Starters' },
              items: [
                { name: 'Bloody Moon', img: '/assets/dishes/bloody-moon-2.webp', al: [7, 8, 11], nut: [612, 24, 36, 42], price: 14.5, es: 'Burrata inyectada con coulis de granada y frambuesa, carpaccio de tomate cherry confitado, higos baby, nuez caramelizada, DUKA ROCE y salsa chili berry.', en: 'Burrata injected with pomegranate and raspberry coulis, candied cherry tomato carpaccio, baby figs, caramelised walnut, ROCE DUKA and chili berry sauce.' },
                {
                  name: 'El Trío', pick: 3, img: '/assets/dishes/el-trio.webp', note: { es: '3 uds', en: '3 pcs' }, al: [1, 3, 6, 7, 11], nut: [498, 28, 48, 22], price: 13.5, es: 'Tortilla de maíz, cebolla encurtida y nuestras salsas.', en: 'Corn tortilla, pickled onion and our sauces.',
                  variants: [
                    { name: 'Pollo', al: [7], es: 'Pollo desmechado, piña, salsa yogur limón.', en: 'Pulled chicken, pineapple, lemon yogurt sauce.' },
                    { name: 'Pato Pekín', al: [1, 6, 11], es: 'Magret de pato, mango, salsa pekín.', en: 'Duck breast, mango, Peking sauce.' },
                    { name: 'Costilla', al: [3], es: 'Costilla de vaca a baja temperatura, aguacate y mayonesa ahumada.', en: 'Slow-cooked beef rib, avocado and smoked mayo.' }
                  ]
                },
                { name: 'Patatas Artesanas', img: '/assets/dishes/patatas-artesanas.webp', al: [3, 7], nut: [562, 10, 64, 28], price: 9.5, es: 'Patata agria en doble cocción, crujiente al centro, con 4 salsas ROCE (más icónicas).', en: 'Double-cooked potato, crispy in the centre, with 4 ROCE sauces (the most iconic).' }
              ]
            },
            {
              title: { es: 'Pokes', en: 'Pokes' },
              items: [
                { name: 'Black Rice Chicken', img: '/assets/dishes/black-rice-chicken.webp', al: [6, 11], nut: [562, 36, 64, 18], price: 13.5, es: 'Arroz salvaje, pollo, edamame, aguacate, pepino, encurtidos, cebolla encurtida, mezcla verde, sésamo y salsa ROCE.', en: 'Wild rice, chicken, edamame, avocado, cucumber, pickles, pickled onion, mixed greens, sesame and ROCE sauce.' },
                { name: 'Black Rice Tuna', img: '/assets/dishes/black-rice-tuna.webp', al: [4, 6, 11], nut: [606, 40, 62, 20], price: 16.5, es: 'Arroz salvaje, atún, edamame, aguacate, pepino, encurtidos, cebolla encurtida, mezcla verde, sésamo y salsa ROCE.', en: 'Wild rice, tuna, edamame, avocado, cucumber, pickles, pickled onion, mixed greens, sesame and ROCE sauce.' },
                { name: 'Forest Walk', img: '/assets/dishes/forest-walk.webp', al: [6, 11], nut: [532, 18, 68, 20], price: 12.5, es: 'Quinoa, kale, espinaca, aguacate, edamame, pepino, manzana, semillas, cebolla encurtida y hierbas frescas.', en: 'Quinoa, kale, spinach, avocado, edamame, cucumber, apple, seeds, pickled onion and fresh herbs.' }
              ]
            },
            {
              title: { es: 'Platos ROCE', en: 'ROCE plates' },
              items: [
                { name: 'Egg & Egg', img: '/assets/dishes/egg-egg.webp', al: [3, 11], nut: [448, 24, 50, 18], price: 10.5, es: 'Huevos camperos, cecina, quinoa, mezcla verde, pepino brunoise, tomate cherry, bacon crujiente, semillas y salsa cítrica.', en: 'Free-range eggs, cured beef, quinoa, mixed greens, diced cucumber, cherry tomato, crispy bacon, seeds and citrus sauce.' },
                { name: 'Primitive Chicken', img: '/assets/dishes/primitive-chicken.webp', al: [3], nut: [632, 42, 62, 24], price: 15.5, es: 'Pollo a la brasa, arroz salvaje, mango, pepino, mezcla verde, garbanzo artesano, maíz, cebolla encurtida, especias ROCE y mayonesa de ajo ahumado.', en: 'Grilled chicken, wild rice, mango, cucumber, mixed greens, artisan chickpeas, corn, pickled onion, ROCE spices and smoked garlic mayo.' },
                { name: 'Citric Nordic', img: '/assets/dishes/citric-nordic.webp', al: [4, 11], nut: [682, 38, 56, 32], price: 17.5, es: 'Salmón a la brasa, arroz salvaje, aguacate, pepino, cebolla encurtida, mezcla verde, sésamo, hierbas frescas y vinagreta cítrica.', en: 'Grilled salmon, wild rice, avocado, cucumber, pickled onion, mixed greens, sesame, fresh herbs and citrus vinaigrette.' },
                { name: 'Muuuuuucho Beef', img: '/assets/dishes/muuuuuucho-beef.webp', al: [7], nut: [756, 48, 60, 36], price: 18.5, es: 'Filete de ternera, patata, maíz, rúcula, cebolla encurtida, kikos, especias ahumadas y chimichurri verde.', en: 'Beef fillet, potato, corn, rocket, pickled onion, toasted corn, smoked spices and green chimichurri.' },
                { name: 'Falafel & Hummus', img: '/assets/dishes/falafel-hummus.webp', al: [11], nut: [618, 22, 68, 28], price: 13.5, es: 'Falafel, hummus de remolacha, pepino, granada, col, mezcla verde, lenteja beluga, sésamo, tahini de limón y salsa yogur limón.', en: 'Falafel, beetroot hummus, cucumber, pomegranate, cabbage, mixed greens, beluga lentils, sesame, lemon tahini and lemon yogurt sauce.' },
                { name: 'La Huerta', img: '/assets/dishes/la-huerta.webp', diet: ['veg', 'pesc', 'vegan', 'gf', 'lf'], al: [11], nut: [548, 16, 66, 26], price: 12.5, es: 'Hummus de remolacha, arándanos, berenjena y calabacín asados, mezcla verde, brotes, albahaca, vinagreta cítrica, cebolla encurtida asada, DUKA ROCE y sal / oliva.', en: 'Beetroot hummus, blueberries, roasted aubergine and courgette, mixed greens, sprouts, basil, citrus vinaigrette, roasted pickled onion, ROCE DUKA and salt / olive oil.' }
              ]
            },
            {
              title: { es: 'Acompañamientos', en: 'Sides' },
              compact: true,
              items: [
                { name: 'Patatas artesanas', img: '/assets/dishes/patatas-acomp.webp', al: [3, 7], nut: [306, 4, 46, 12], price: 3.5 }, { name: 'Garbanzo artesano', img: '/assets/dishes/garbanzo-artesano.webp', diet: ['veg', 'pesc', 'vegan', 'gf', 'lf'], nut: [218, 9, 32, 6], price: 3.5 }, { name: 'Frijoles marinados', img: '/assets/dishes/frijoles-marinados.webp', diet: ['veg', 'pesc', 'vegan', 'gf', 'lf'], nut: [176, 8, 28, 4], price: 3.5 },
                { name: 'Maíz especiado', img: '/assets/dishes/maiz-especiado.webp', diet: ['veg', 'pesc', 'vegan', 'gf', 'lf'], nut: [196, 5, 30, 6], price: 3.5 }, { name: 'Boniato al carbón', img: '/assets/dishes/boniato-al-carbon.webp', diet: ['veg', 'pesc', 'vegan', 'gf', 'lf'], nut: [224, 3, 44, 5], price: 3.5 }
              ]
            },
            {
              title: { es: 'Más proteína', en: 'More protein' }, key: 'Extras', note: { es: 'Todo el día', en: 'All day' },
              compact: true,
              items: [
                { name: 'Huevo campero', img: '/assets/dishes/huevo.webp', al: [3], nut: [72, 6, 1, 5], price: 2 }, { name: 'Falafel', img: '/assets/dishes/falafel.webp', diet: ['veg', 'pesc', 'vegan', 'gf', 'lf'], al: [11], nut: [188, 8, 24, 7], price: 3.5 }, { name: 'Cottage', img: '/assets/dishes/cottage.webp', al: [7], nut: [82, 11, 3, 3], price: 2.5 },
                { name: 'Pollo marinado', img: '/assets/dishes/pollo-marinado.webp', nut: [166, 27, 4, 5], price: 4.5 }, { name: 'Atún rojo', img: '/assets/dishes/atun-rojo.webp', al: [4], nut: [164, 32, 0, 4], price: 6.5 }, { name: 'Salmón', img: '/assets/dishes/salmon.webp', al: [4], nut: [226, 34, 0, 10], price: 6.5 },
                { name: 'Filete de ternera', img: '/assets/dishes/filete-ternera.webp', nut: [324, 42, 0, 16], price: 9.5 }, { name: 'Entrecot madurado', img: '/assets/dishes/entrecot.webp', nut: [418, 46, 0, 24], price: 15 }, { name: 'Bacon crujiente', img: '/assets/dishes/bacon.webp', nut: [126, 8, 1, 10], price: 2.5 }, { name: 'Hummus de remolacha', img: '/assets/dishes/hummus-remolacha.webp', diet: ['veg', 'pesc', 'vegan', 'gf', 'lf'], al: [11], nut: [118, 4, 12, 6], price: 2.5 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'bebidas', color: 'olive', title: { es: 'Bebidas', en: 'Drinks' },
      groups: [
        {
          title: { es: 'Drinks', en: 'Drinks' },
          blocks: [
            {
              title: { es: 'Cafés', en: 'Coffees' }, compact: true, alPending: true,
              items: [
                { name: 'Espresso', img: '/assets/dishes/espresso.webp', price: 2.2 }, { name: 'Double espresso', img: '/assets/dishes/double-espresso.webp', price: 3 }, { name: 'Cortado', img: '/assets/dishes/cortado.webp', price: 2.4 }, { name: 'Americano', img: '/assets/dishes/americano.webp', price: 2.7 },
                { name: 'Latte', img: '/assets/dishes/latte.webp', price: 3.5 }, { name: 'Flat white', img: '/assets/dishes/flat-white.webp', price: 3.8 }, { name: 'Mocca latte', img: '/assets/dishes/mocca-latte.webp', price: 4.5 }
              ],
              extras: { title: { es: 'Extras', en: 'Extras' }, list: [[{ es: 'Iced', en: 'Iced' }, '+0,50'], [{ es: 'Doble carga', en: 'Double shot' }, '+1,00'], [{ es: 'Vegetal barista', en: 'Barista plant milk' }, '+0,50'], [{ es: 'Con hielo', en: 'On ice' }, '+0,15'], [{ es: 'Descafeinado', en: 'Decaf' }, '']] }
            },
            {
              title: { es: 'Matcha & Tés', en: 'Matcha & Teas' }, compact: true, alPending: true,
              items: [
                { name: 'Matcha', img: '/assets/dishes/matcha.webp', price: 3.5 }, { name: 'Matcha latte', img: '/assets/dishes/matcha-latte.webp', price: 4.5 }, { name: 'Iced matcha latte', img: '/assets/dishes/iced-matcha-latte.webp', price: 4.9 }, { name: 'Té verde', img: '/assets/dishes/te-verde.webp', price: 2.8 },
                { name: 'Té negro', img: '/assets/dishes/te-negro.webp', price: 2.8 }, { name: 'Té rojo', img: '/assets/dishes/te-rojo.webp', price: 2.8 }, { name: 'Rooibos', img: '/assets/dishes/rooibos.webp', price: 2.8 }, { name: 'Manzanilla', img: '/assets/dishes/manzanilla.webp', price: 2.5 },
                { name: 'Menta poleo', img: '/assets/dishes/menta-poleo.webp', price: 2.5 }, { name: 'Digestivo', img: '/assets/dishes/digestivo.webp', price: 2.5 }
              ]
            },
            {
              title: { es: 'Smoothies', en: 'Smoothies' }, note: { es: 'Con fruta natural', en: 'Made with real fruit' }, alPending: true,
              items: [
                { code: '01', name: 'Marathon Rat', img: '/assets/dishes/marathon-rat.webp', nut: [172, 3, 42, 1], price: 6, es: 'Mango · Piña · Maracuyá · Zumo de naranja', en: 'Mango · Pineapple · Passion fruit · Orange juice', tag: { es: 'Aporta energía de forma natural.', en: 'Natural energy.' } },
                { code: '02', name: 'Purple Haze', img: '/assets/dishes/purple-haze.webp', nut: [166, 3, 33, 4], price: 7, es: 'Açaí · Fresa · Plátano · Frutos rojos', en: 'Açaí · Strawberry · Banana · Red berries', tag: { es: 'Rico en antioxidantes y vitaminas.', en: 'Rich in antioxidants and vitamins.' } },
                { code: '03', name: 'Out of the F*cking Office', img: '/assets/dishes/out-of-the-office.webp', nut: [270, 9, 36, 11], price: 6, es: 'Piña · Plátano · Coco · Yogur griego', en: 'Pineapple · Banana · Coconut · Greek yogurt', tag: { es: 'Cremoso, nutritivo y refrescante.', en: 'Creamy, nourishing and refreshing.' } },
                { code: '04', name: '404 Error Not Found', img: '/assets/dishes/404-error-not-found.webp', nut: [90, 2, 23, 1], price: 6, es: 'Espinaca · Manzana verde · Pepino · Limón · Jengibre', en: 'Spinach · Green apple · Cucumber · Lemon · Ginger', tag: { es: 'Limpia, refresca y aporta fibra.', en: 'Cleansing, refreshing and full of fibre.' } },
                { code: '05', name: 'Red Lips', img: '/assets/dishes/red-lips.webp', nut: [261, 11, 41, 6], price: 6, es: 'Frutos rojos · Plátano · Avena · Yogur griego · Canela', en: 'Red berries · Banana · Oats · Greek yogurt · Cinnamon', tag: { es: 'Equilibrio y bienestar.', en: 'Balance and wellbeing.' } },
                { code: '06', name: '6AM in Kyoto', img: '/assets/dishes/6am-in-kyoto.webp', nut: [225, 9, 32, 7], price: 7, es: 'Té matcha · Plátano · Yogur griego · Bebida de avena', en: 'Matcha tea · Banana · Greek yogurt · Oat drink', tag: { es: 'Energía sostenida y concentración.', en: 'Steady energy and focus.' } }
              ]
            },
            {
              title: { es: 'Zumos naturales', en: 'Fresh juices' }, alPending: true,
              items: [
                { code: '07', name: 'Depure', img: '/assets/dishes/depure.webp', nut: [105, 2, 26, 1], price: 5.5, es: 'Manzana verde · Pepino · Apio · Limón · Jengibre', en: 'Green apple · Cucumber · Celery · Lemon · Ginger', tag: { es: 'Ayuda a depurar el organismo.', en: 'Helps cleanse the body.' } },
                { code: '08', name: 'Vitality', img: '/assets/dishes/vitality.webp', nut: [160, 3, 37, 1], price: 5.5, es: 'Naranja · Zanahoria · Manzana · Jengibre', en: 'Orange · Carrot · Apple · Ginger', tag: { es: 'Aporta vitaminas y combate el cansancio.', en: 'Vitamins to fight tiredness.' } },
                { code: '09', name: 'Anti-inflammatory', img: '/assets/dishes/anti-inflammatory.webp', nut: [120, 1, 30, 0], price: 6, es: 'Piña · Cúrcuma · Manzana · Limón · Jengibre', en: 'Pineapple · Turmeric · Apple · Lemon · Ginger', tag: { es: 'Contribuye a reducir la inflamación.', en: 'Helps reduce inflammation.' } },
                { code: '10', name: 'Immunity', img: '/assets/dishes/immunity.webp', nut: [135, 2, 32, 1], price: 6, es: 'Naranja · Pomelo · Zanahoria · Jengibre', en: 'Orange · Grapefruit · Carrot · Ginger', tag: { es: 'Rico en vitamina C y fortalece las defensas.', en: 'Rich in vitamin C, boosts your defences.' } },
                { code: '11', name: 'Probiotic', img: '/assets/dishes/probiotic.webp', nut: [150, 4, 30, 3], price: 6, es: 'Piña · Manzana · Limón · Kéfir natural', en: 'Pineapple · Apple · Lemon · Natural kefir', tag: { es: 'Mejora la digestión y cuida la microbiota.', en: 'Improves digestion and cares for your gut.' } }
              ]
            }
          ]
        }
      ]
    },
    { id: 'bakery', color: 'dark', soon: true, title: { es: 'Bakery', en: 'Bakery' }, desc: { es: 'Bollería, dulces y horno.', en: 'Pastries, sweets and bakery.' }, groups: [] }
  ]
};

/* Las cinco cartas, en este orden: Kitchen · Fresh Juices · Bakery · Coffee & Matcha · Drinks.
   Se componen a partir de los bloques de arriba (el bloque "Drinks" se reparte entre Coffee & Matcha y Fresh Juices). */
(function () {
  var C = window.CARTA, by = {};
  C.sections.forEach(function (s) { by[s.id] = s; });
  var drinks = by.bebidas.groups[0].blocks;
  function sheet(id, color, es, en, blocks) { return { id: id, color: color, title: { es: es, en: en }, groups: [{ title: { es: es, en: en }, blocks: blocks }] }; }
  C.sections = [
    by.kitchen,
    sheet('fresh', 'red', 'Fresh Juices', 'Fresh Juices', [drinks[2], drinks[3]]),
    by.bakery,
    sheet('coffee', 'olive', 'Coffee & Matcha', 'Coffee & Matcha', [drinks[0], drinks[1]]),
    { id: 'drinks', color: 'lgray', title: { es: 'Drinks', en: 'Drinks' }, desc: { es: 'Refrescos, aguas y cervezas.', en: 'Soft drinks, water and beers.' }, groups: [{
      title: { es: 'Drinks', en: 'Drinks' },
      blocks: [
              { title: { es: 'Cervezas', en: 'Beers' }, note: { es: 'Tercios · Solo mayores de 18 años', en: 'Tercios · 18+ only' }, compact: true, alPending: true, items: [
                { name: 'Alhambra Reserva 1925', price: 3.5 }, { name: 'Alhambra Reserva Roja', price: 4 }, { name: 'Mahou 5 Estrellas', price: 3.3 }, { name: 'Mahou Reserva', price: 3.8 }, { name: 'Mahou Session IPA', price: 4 }, { name: 'Mahou Sin Gluten', price: 3.5 }, { name: 'Mahou 0,0 Tostada', price: 3.3 }
              ] },
              { title: { es: 'Vermuts', en: 'Vermouths' }, note: { es: 'Solo mayores de 18 años', en: '18+ only' }, compact: true, alPending: true, items: [
                { name: 'Vermut casero ROCE', price: 3.5 }, { name: 'Martini Rosso', price: 4.5 }, { name: 'Martini Bianco', price: 4.5 }, { name: 'Martini Fiero', price: 5 }, { name: 'Martini Rosato', price: 4.5 }
              ] },
              { title: { es: 'Refrescos', en: 'Soft drinks' }, compact: true, alPending: true, items: [
                { name: 'Pepsi', price: 3.5 }, { name: 'Pepsi 0', price: 3.5 }, { name: 'Kas Limón', price: 3.5 }, { name: 'Kas Naranja', price: 3.5 }, { name: 'Aquarade Limón', price: 3.5 }, { name: 'Aquarade Naranja', price: 3.5 }, { name: '7UP', price: 3.5 }, { name: 'Lipton', price: 3.5 }
              ] },
              { title: { es: 'Aguas', en: 'Water' }, compact: true, alPending: true, items: [
                { name: 'Solán de Cabras 0,5 L', price: 2.5 }, { name: 'Solán de Cabras con gas 0,5 L', price: 2.8 }
              ] }
      ]
    }] }
    ,{ id: 'wines', color: 'wine', title: { es: 'Wines', en: 'Wines' }, desc: { es: 'Carta de vinos.', en: 'Wine list.' }, groups: [{
      title: { es: 'Wines', en: 'Wines' },
      blocks: [
              { title: { es: 'Por copas', en: 'By the glass' }, note: { es: 'Solo mayores de 18 años · Precio por copa', en: '18+ only · Price per glass' }, view: true, items: [
                { name: "Rippa Dorii", price: 4.5, al: [12], tag: { es: "Verdejo · Rueda", en: "Verdejo · Rueda" } },
                { name: "Viña Zorzal", price: 5, al: [12], tag: { es: "Chardonnay · Navarra", en: "Chardonnay · Navarra" } },
                { name: "Brezo Blanco 2025", price: 5.5, al: [12], tag: { es: "Godello · Bierzo", en: "Godello · Bierzo" } },
                { name: "Casagrande 2021", price: 4, al: [12], tag: { es: "Bobal · Utiel-Requena", en: "Bobal · Utiel-Requena" } },
                { name: "Mayela 2024", price: 5, al: [12], tag: { es: "Tempranillo · Rioja", en: "Tempranillo · Rioja" } },
                { name: "Divina Clementia", price: 6, al: [12], tag: { es: "Mencía · Ribeira Sacra", en: "Mencía · Ribeira Sacra" } }
              ] },
              { title: { es: 'Blancos', en: 'Whites' }, note: { es: 'Solo mayores de 18 años · Precio por botella', en: '18+ only · Price per bottle' }, view: true, items: [
                { name: "Leirana 2025", price: 25.2, al: [12], tag: { es: "Albariño · Forjas del Salnés · Rodrigo Méndez y Raúl Pérez · D.O. Rías Baixas", en: "Albariño · Forjas del Salnés · Rodrigo Méndez y Raúl Pérez · D.O. Rías Baixas" } },
                { name: "Brezo Blanco 2025", price: 22.4, al: [12], tag: { es: "Godello · Bodegas Mengoba · Gregory Pérez · D.O. Bierzo", en: "Godello · Bodegas Mengoba · Gregory Pérez · D.O. Bierzo" } },
                { name: "Divina Clementia 2024", price: 24, al: [12], tag: { es: "Godello · Raúl Suárez · D.O. Ribeira Sacra", en: "Godello · Raúl Suárez · D.O. Ribeira Sacra" } },
                { name: "Rippa Dorii 2025", price: 14, al: [12], tag: { es: "Verdejo y Viura · Bodegas Ontañón · D.O. Rueda", en: "Verdejo y Viura · Bodegas Ontañón · D.O. Rueda" } },
                { name: "Basa 2025", price: 17.5, al: [12], tag: { es: "Verdejo y Viura · Verdejo, Viura · Telmo Rodríguez · D.O. Rueda", en: "Verdejo y Viura · Verdejo, Viura · Telmo Rodríguez · D.O. Rueda" } },
                { name: "Legaris Verdejo 2025", price: 23, al: [12], tag: { es: "Verdejo y Viura · Legaris · Valladolid · D.O. Rueda", en: "Verdejo y Viura · Legaris · Valladolid · D.O. Rueda" } },
                { name: "Zorzal 2025", price: 15.6, al: [12], tag: { es: "Chardonnay · Zorzal · D.O. Navarra", en: "Chardonnay · Zorzal · D.O. Navarra" } },
                { name: "Chablis 2023", price: 47.6, al: [12], tag: { es: "Chardonnay · Domaine Corinne et Jean-Pierre Grossot · Bourgogne · Francia", en: "Chardonnay · Domaine Corinne et Jean-Pierre Grossot · Bourgogne · Francia" } },
                { name: "Cullerot 2024", price: 27, al: [12], tag: { es: "Coupages mediterráneos · Celler del Roure · Pablo Calatayud · D.O. Valencia", en: "Coupages mediterráneos · Celler del Roure · Pablo Calatayud · D.O. Valencia" } }
              ] },
              { title: { es: 'Rosado', en: 'Rosé' }, note: { es: 'Solo mayores de 18 años · Precio por botella', en: '18+ only · Price per bottle' }, view: true, items: [
                { name: "Zorzal Rosado 2025", price: 15.6, al: [12], tag: { es: "Garnacha · Zorzal · D.O. Navarra", en: "Garnacha · Zorzal · D.O. Navarra" } }
              ] },
              { title: { es: 'Espumosos', en: 'Sparkling' }, note: { es: 'Solo mayores de 18 años · Precio por botella', en: '18+ only · Price per bottle' }, view: true, items: [
                { name: "Roger de Flor Brut Nature", price: 18, al: [12], tag: { es: "Cava · Macabeo, Xarel·lo, Parellada · Penedès · D.O. Cava", en: "Cava · Macabeo, Xarel·lo, Parellada · Penedès · D.O. Cava" } },
                { name: "Ars Collecta Blanc de Noirs", price: 32, al: [12], tag: { es: "Cava · 85% Pinot Noir, 15% Xarel·lo y Macabeo · Codorníu · D.O. Cava", en: "Cava · 85% Pinot Noir, 15% Xarel·lo y Macabeo · Codorníu · D.O. Cava" } },
                { name: "Clímax Brut Nature Rosat 2022", price: 39, al: [12], tag: { es: "Cava · 100% Pinot Noir · Can Ràfols dels Caus · D.O. Cava", en: "Cava · 100% Pinot Noir · Can Ràfols dels Caus · D.O. Cava" } },
                { name: "André Clouet Grande Réserve Blanc de Noirs", price: 57, al: [12], tag: { es: "Champagne · Pinot Noir · Grand Cru · André Clouet · Bouzy · Francia", en: "Champagne · Pinot Noir · Grand Cru · André Clouet · Bouzy · Francia" } },
                { name: "Moët & Chandon Brut", price: 64, al: [12], tag: { es: "Champagne · Champagne · Francia", en: "Champagne · Champagne · Francia" } },
                { name: "Bollinger Special Cuvée", price: 105, al: [12], tag: { es: "Champagne · Champagne · Francia", en: "Champagne · Champagne · Francia" } },
                { name: "Perrier-Jouët Rosé", price: 117, al: [12], tag: { es: "Champagne · Champagne · Francia", en: "Champagne · Champagne · Francia" } },
                { name: "Dom Pérignon Vintage", price: 345, al: [12], tag: { es: "Champagne · Champagne · Francia", en: "Champagne · Champagne · Francia" } },
                { name: "Dom Pérignon Rosé Vintage", price: 535, al: [12], tag: { es: "Champagne · Champagne · Francia", en: "Champagne · Champagne · Francia" } }
              ] },
              { title: { es: 'Tintos', en: 'Reds' }, note: { es: 'Solo mayores de 18 años · Precio por botella', en: '18+ only · Price per bottle' }, view: true, items: [
                { name: "Mayela 2024", price: 16, al: [12], tag: { es: "Tempranillo · Bodega Bideona · D.O.Ca. Rioja", en: "Tempranillo · Bodega Bideona · D.O.Ca. Rioja" } },
                { name: "Caliel Joven 2025", price: 17, al: [12], tag: { es: "Tempranillo · Raúl Calvo · D.O. Ribera del Duero", en: "Tempranillo · Raúl Calvo · D.O. Ribera del Duero" } },
                { name: "Selvanevada 2022", price: 22.5, al: [12], tag: { es: "Tempranillo · Tempranillo, Graciano, Garnacha, Mazuela · Villota · Jesús Madrazo y Carmen Pérez Garrigues · D.O.Ca. Rioja", en: "Tempranillo · Tempranillo, Graciano, Garnacha, Mazuela · Villota · Jesús Madrazo y Carmen Pérez Garrigues · D.O.Ca. Rioja" } },
                { name: "Viña Pomal Crianza 2022", price: 23, al: [12], tag: { es: "Tempranillo · Bodegas Bilbaínas · Haro · Rioja Alta · D.O.Ca. Rioja", en: "Tempranillo · Bodegas Bilbaínas · Haro · Rioja Alta · D.O.Ca. Rioja" } },
                { name: "Legaris Crianza 2021", price: 28, al: [12], tag: { es: "Tempranillo · Legaris · Curiel de Duero · D.O. Ribera del Duero", en: "Tempranillo · Legaris · Curiel de Duero · D.O. Ribera del Duero" } },
                { name: "San Cobate La Finca 2021", price: 31.5, al: [12], tag: { es: "Tempranillo · San Cobate · D.O. Ribera del Duero", en: "Tempranillo · San Cobate · D.O. Ribera del Duero" } },
                { name: "Lanzaga 2021", price: 46.5, al: [12], tag: { es: "Tempranillo · Tempranillo, Garnacha, Graciano · Bodega Lanzaga · Telmo Rodríguez y Pablo Eguzkiza · D.O.Ca. Rioja", en: "Tempranillo · Tempranillo, Garnacha, Graciano · Bodega Lanzaga · Telmo Rodríguez y Pablo Eguzkiza · D.O.Ca. Rioja" } },
                { name: "Clos Lojen 2025", price: 18, al: [12], tag: { es: "Monastrell, Bobal y mediterráneos · Bobal · Bodegas y Viñedos Ponce · Juan Antonio Ponce · D.O. Manchuela", en: "Monastrell, Bobal y mediterráneos · Bobal · Bodegas y Viñedos Ponce · Juan Antonio Ponce · D.O. Manchuela" } },
                { name: "Vermell 2024", price: 18, al: [12], tag: { es: "Monastrell, Bobal y mediterráneos · Monastrell, Garnacha Tintorera, Mandó · Celler del Roure · Pablo Calatayud · D.O. Valencia", en: "Monastrell, Bobal y mediterráneos · Monastrell, Garnacha Tintorera, Mandó · Celler del Roure · Pablo Calatayud · D.O. Valencia" } },
                { name: "Les Alcusses 2023", price: 19, al: [12], tag: { es: "Monastrell, Bobal y mediterráneos · Cabernet Sauvignon, Merlot, Monastrell, Tempranillo · Celler del Roure · Pablo Calatayud · D.O. Valencia", en: "Monastrell, Bobal y mediterráneos · Cabernet Sauvignon, Merlot, Monastrell, Tempranillo · Celler del Roure · Pablo Calatayud · D.O. Valencia" } },
                { name: "Casagrande 2021", price: 20, al: [12], tag: { es: "Monastrell, Bobal y mediterráneos · Bobal · Vinícola Requenense · D.O. Utiel-Requena", en: "Monastrell, Bobal y mediterráneos · Bobal · Vinícola Requenense · D.O. Utiel-Requena" } },
                { name: "El Tiempo que nos une 2025", price: 21, al: [12], tag: { es: "Monastrell, Bobal y mediterráneos · Monastrell · Bodega Cerrón · D.O. Jumilla", en: "Monastrell, Bobal y mediterráneos · Monastrell · Bodega Cerrón · D.O. Jumilla" } },
                { name: "Las Cabañuelas 2021", price: 22, al: [12], tag: { es: "Garnacha · Viñedos del Jorco · César Ruiz, Nacho Jiménez, Flequi Berruti y Raúl Pérez · D.O.P. Cebreros · Sierra de Gredos", en: "Garnacha · Viñedos del Jorco · César Ruiz, Nacho Jiménez, Flequi Berruti y Raúl Pérez · D.O.P. Cebreros · Sierra de Gredos" } },
                { name: "Châteauneuf-du-Pape Télégramme 2023", price: 69.5, al: [12], tag: { es: "Garnacha · Grenache, Mourvèdre · Domaine du Vieux Télégraphe · Rhône · Francia", en: "Garnacha · Grenache, Mourvèdre · Domaine du Vieux Télégraphe · Rhône · Francia" } },
                { name: "Divina Clementia 2022", price: 24, al: [12], tag: { es: "Mencía · Raúl Suárez · D.O. Ribeira Sacra", en: "Mencía · Raúl Suárez · D.O. Ribeira Sacra" } },
                { name: "Guímaro Finca Meixemán 2023", price: 41.6, al: [12], tag: { es: "Mencía · Guímaro · D.O. Ribeira Sacra", en: "Mencía · Guímaro · D.O. Ribeira Sacra" } },
                { name: "Barolo Berri Comune di La Morra 2022", price: 78, al: [12], tag: { es: "Nebbiolo · Trediberri · Barolo · Italia", en: "Nebbiolo · Trediberri · Barolo · Italia" } },
                { name: "Emilien 2020", price: 83, al: [12], tag: { es: "Merlot · Merlot, Cabernet Franc, Malbec, Carménère · Château Le Puy · Lussac-Saint-Émilion · Bordeaux · Francia", en: "Merlot · Merlot, Cabernet Franc, Malbec, Carménère · Château Le Puy · Lussac-Saint-Émilion · Bordeaux · Francia" } },
                { name: "Gevrey-Chambertin Vieilles Vignes 2022", price: 98, al: [12], tag: { es: "Pinot Noir · Domaine Faiveley · Bourgogne · Francia", en: "Pinot Noir · Domaine Faiveley · Bourgogne · Francia" } },
                { name: "Gevrey-Chambertin Cuvée de l'Aulne 2023", price: 145, al: [12], tag: { es: "Pinot Noir · Laurent Ponsot · Bourgogne · Francia", en: "Pinot Noir · Laurent Ponsot · Bourgogne · Francia" } }
              ] }
      ]
    }] }
    ,{ id: 'spirits', color: 'dark', title: { es: 'Spirits', en: 'Spirits' }, desc: { es: 'Copas y chupitos.', en: 'Spirits and shots.' }, groups: [{
      title: { es: 'Spirits', en: 'Spirits' },
      blocks: [
              { title: { es: 'Ginebras', en: 'Gin' }, note: { es: 'Solo mayores de 18 años · Precio por copa · Combinados con Red Bull +1,50 €', en: '18+ only · Price per glass · Mixed with Red Bull +€1.50' }, view: true, alPending: true, items: [
                { name: "Tanqueray", price: 10 },
                { name: "Tanqueray Nº Ten", price: 12 },
                { name: "Tanqueray 0,0", price: 10, tag: { es: "Sin alcohol", en: "Alcohol-free" } },
                { name: "Bombay Sapphire", price: 10 },
                { name: "Beefeater", price: 10 },
                { name: "Larios 12", price: 9 },
                { name: "Larios Rosé", price: 9 },
                { name: "Puerto de Indias Fresa", price: 10 },
                { name: "Puerto de Indias Mora", price: 10 },
                { name: "Puerto de Indias Melón", price: 10 },
                { name: "Hendrick's", price: 12 },
                { name: "Nordés", price: 12 },
                { name: "Bulldog", price: 12 },
                { name: "Martin Miller's", price: 15 },
                { name: "Roku", price: 15 },
                { name: "Gin Mare", price: 15 }
              ] },
              { title: { es: 'Vodka', en: 'Vodka' }, note: { es: 'Solo mayores de 18 años · Precio por copa · Combinados con Red Bull +1,50 €', en: '18+ only · Price per glass · Mixed with Red Bull +€1.50' }, view: true, alPending: true, items: [
                { name: "Smirnoff", price: 8 },
                { name: "Absolut", price: 10, tag: { es: "Chupito 4,00 €", en: "Shot 4,00 €" } },
                { name: "Cîroc", price: 12 },
                { name: "Cîroc Apple", price: 13 },
                { name: "Cîroc Pineapple", price: 13 },
                { name: "Cîroc Coconut", price: 13 },
                { name: "Cîroc Peach", price: 13 },
                { name: "Cîroc Red Berry", price: 13 },
                { name: "Grey Goose", price: 17, tag: { es: "Chupito 8,50 €", en: "Shot 8,50 €" } }
              ] },
              { title: { es: 'Licores', en: 'Liqueurs' }, note: { es: 'Solo mayores de 18 años · Precio por copa', en: '18+ only · Price per glass' }, view: true, alPending: true, items: [
                { name: "Terry", price: 6 },
                { name: "Amaretto", price: 6 },
                { name: "Baileys", price: 6 },
                { name: "Frangelico", price: 6 },
                { name: "Licor 43", price: 6 },
                { name: "Jägermeister", price: 6, tag: { es: "Con hielo", en: "On the rocks" } },
                { name: "Jägermeister + Red Bull", price: 13 }
              ] },
              { title: { es: 'Whisky', en: 'Whisky' }, note: { es: 'Solo mayores de 18 años · Precio por copa · Combinados con Red Bull +1,50 €', en: '18+ only · Price per glass · Mixed with Red Bull +€1.50' }, view: true, alPending: true, items: [
                { name: "DYC 8", price: 10, tag: { es: "Chupito 4,00 €", en: "Shot 4,00 €" } },
                { name: "Jim Beam", price: 10, tag: { es: "Chupito 4,00 €", en: "Shot 4,00 €" } },
                { name: "Johnnie Walker Red Label", price: 10, tag: { es: "Chupito 4,50 €", en: "Shot 4,50 €" } },
                { name: "Jameson", price: 11, tag: { es: "Chupito 4,00 €", en: "Shot 4,00 €" } },
                { name: "Jack Daniel's", price: 12, tag: { es: "Chupito 5,00 €", en: "Shot 5,00 €" } },
                { name: "Johnnie Walker Black Label", price: 15, tag: { es: "Chupito 6,00 €", en: "Shot 6,00 €" } },
                { name: "Toki", price: 17, tag: { es: "Chupito 8,00 €", en: "Shot 8,00 €" } },
                { name: "The Macallan 12", price: 23, tag: { es: "Chupito 10,00 €", en: "Shot 10,00 €" } },
                { name: "Laphroaig", price: 23, tag: { es: "Chupito 10,00 €", en: "Shot 10,00 €" } },
                { name: "Hibiki", price: 25, tag: { es: "Chupito 12,00 €", en: "Shot 12,00 €" } }
              ] },
              { title: { es: 'Ron', en: 'Rum' }, note: { es: 'Solo mayores de 18 años · Precio por copa · Combinados con Red Bull +1,50 €', en: '18+ only · Price per glass · Mixed with Red Bull +€1.50' }, view: true, alPending: true, items: [
                { name: "Malibú", price: 9 },
                { name: "Negrita", price: 9, tag: { es: "Chupito 4,00 €", en: "Shot 4,00 €" } },
                { name: "Brugal", price: 10, tag: { es: "Chupito 4,00 €", en: "Shot 4,00 €" } },
                { name: "Barceló", price: 11, tag: { es: "Chupito 4,00 €", en: "Shot 4,00 €" } },
                { name: "Havana Club 7", price: 11, tag: { es: "Chupito 4,00 €", en: "Shot 4,00 €" } },
                { name: "Santa Teresa", price: 11, tag: { es: "Chupito 4,00 €", en: "Shot 4,00 €" } },
                { name: "Brugal Doble Reserva", price: 12, tag: { es: "Chupito 5,00 €", en: "Shot 5,00 €" } },
                { name: "Zacapa", price: 15, tag: { es: "Chupito 6,00 €", en: "Shot 6,00 €" } }
              ] },
              { title: { es: 'Otros chupitos', en: 'Other shots' }, note: { es: 'Solo mayores de 18 años · Precio por chupito', en: '18+ only · Price per shot' }, view: true, alPending: true, items: [
                { name: "Limoncello", price: 3 },
                { name: "Hierbas", price: 3 },
                { name: "Mistela", price: 3 },
                { name: "Cazalla", price: 3 },
                { name: "Tequila de fresa", price: 3 },
                { name: "Jägermeister", price: 5 },
                { name: "Astral", price: 8, tag: { es: "Tequila", en: "Tequila" } },
                { name: "Astral Reposado", price: 9, tag: { es: "Tequila", en: "Tequila" } },
                { name: "Don Julio Blanco", price: 10, tag: { es: "Tequila", en: "Tequila" } },
                { name: "Don Julio Reposado", price: 12, tag: { es: "Tequila", en: "Tequila" } }
              ] }
      ]
    }] }
  ];
})();
