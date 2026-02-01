import { Activity, Coords, Pronunciation, AudioTrack } from './types';

export const SHIP_DEPARTURE_TIME = "17:00";
export const ARRIVAL_TIME = "07:00";
export const ONBOARD_TIME = "16:30";
export const UPDATE_DATE = "10 de diciembre de 2025";

export const COORDS: Record<string, Coords> = {
    CRUISE_DOCK: { lat: 62.469187, lng: 6.156024 },
    KORSEGATA_BUS: { lat: 62.471565, lng: 6.155352 },
    BUS_STATION: { lat: 62.471507, lng: 6.155385 },
    ALNES_LIGHTHOUSE: { lat: 62.489265, lng: 5.965505 },
    ALNES_BUS_STOP: { lat: 62.487027, lng: 5.972907 },
    AKSLA_VIEWPOINT: { lat: 62.474297, lng: 6.164615 },
    ART_NOUVEAU_CENTER: { lat: 62.471047, lng: 6.151177 },
    ALESUND_CHURCH: { lat: 62.471255, lng: 6.146431 }
};

export const INITIAL_ITINERARY: Activity[] = [
    {
        id: '1', title: 'Atraque MSC Euribia', startTime: '07:00', endTime: '07:00',
        locationName: 'Muelle de Cruceros', coords: COORDS.CRUISE_DOCK,
        description: 'El barco llega a puerto.',
        fullDescription: 'El barco llega a puerto. Prepárate para salir. Disfruta de la entrada al puerto con la vista de la ciudad Art Nouveau.',
        tips: 'Sincroniza tu reloj con la hora del barco antes de salir.',
        keyDetails: 'Hora de llegada.',
        priceNOK: 0, priceEUR: 0, type: 'logistics', completed: false,
        instagramUrl: 'https://www.instagram.com/explore/tags/msceuribia/'
    },
    {
        id: '2', title: 'Desembarque', startTime: '07:15', endTime: '07:30',
        locationName: 'Muelle', coords: COORDS.CRUISE_DOCK,
        description: 'Baja del barco y dirígete a la salida.',
        fullDescription: 'Baja del barco y dirígete a la salida del muelle. El centro está muy cerca.',
        tips: 'Ten a mano la APP FRAM descargada para el bus.',
        keyDetails: 'Salida rápida.',
        priceNOK: 0, priceEUR: 0, type: 'logistics', completed: false,
        instagramUrl: 'https://www.instagram.com/explore/tags/alesundhavn/'
    },
    {
        id: '3', title: 'Caminata a Parada Bus', startTime: '07:30', endTime: '07:50',
        locationName: 'Muelle', endLocationName: 'Parada Korsegata',
        coords: COORDS.CRUISE_DOCK, endCoords: COORDS.KORSEGATA_BUS,
        description: 'Camina hacia la parada Korsegata (10-15 min).',
        fullDescription: 'Camina hacia la parada de autobús Korsegata. Es un paseo breve desde el muelle hacia el centro.',
        tips: 'Usa el GPS de la app si tienes dudas.',
        keyDetails: '10-15 min a pie.',
        priceNOK: 0, priceEUR: 0, type: 'logistics', completed: false,
        instagramUrl: 'https://www.instagram.com/explore/tags/korsegata/'
    },
    {
        id: '4', title: 'Bus hacia el Faro', startTime: '08:00', endTime: '09:00',
        locationName: 'Parada Korsegata', endLocationName: 'Isla de Godøya',
        coords: COORDS.KORSEGATA_BUS, endCoords: COORDS.ALNES_LIGHTHOUSE,
        description: 'Ruta escénica por túneles submarinos.',
        fullDescription: 'IDA. Toma el bus en Korsegata. Disfruta del paisaje atravesando los túneles submarinos hacia la isla de Godøya.',
        tips: 'Precio: 48 NOK por trayecto. Paga con App FRAM. Si pagas al conductor puede tener recargo o requerir efectivo.',
        keyDetails: 'Bus Público (FRAM).',
        priceNOK: 48, priceEUR: 4.20, type: 'transport', completed: false,
        ticketUrl: 'https://play.google.com/store/apps/details?id=no.frammr.fram&hl=es',
        routeUrl: `https://www.google.com/maps/dir/?api=1&origin=${COORDS.KORSEGATA_BUS.lat},${COORDS.KORSEGATA_BUS.lng}&destination=${COORDS.ALNES_BUS_STOP.lat},${COORDS.ALNES_BUS_STOP.lng}&travelmode=transit`,
        instagramUrl: 'https://www.instagram.com/explore/tags/godøya/'
    },
    {
        id: '5', title: 'Faro de Alnes (Alnes Fyr)', startTime: '09:10', endTime: '10:30',
        locationName: 'Faro de Alnes', coords: COORDS.ALNES_LIGHTHOUSE,
        description: 'Tiempo libre para visitar el faro y la costa.',
        fullDescription: 'Tiempo libre para visitar el faro, caminar por la costa y disfrutar del aire libre. Cafetería disponible si está abierta.',
        tips: 'El clima en el Faro puede ser ventoso. Lleva cortavientos.',
        keyDetails: 'Vistas al océano Atlántico.',
        priceNOK: 0, priceEUR: 0, type: 'sightseeing', completed: false,
        instagramUrl: 'https://www.instagram.com/explore/tags/alnesfyr/'
    },
    {
        id: '6', title: 'Bus de Regreso', startTime: '10:47', endTime: '11:47',
        locationName: 'Parada Alnes', endLocationName: 'Centro Ålesund',
        coords: COORDS.ALNES_BUS_STOP, endCoords: COORDS.KORSEGATA_BUS,
        description: 'VUELTA. ¡Sé puntual! El bus no espera.',
        fullDescription: 'Toma el bus en la parada Alnes para volver al centro.',
        tips: 'Llega a la parada de Alnes 10 minutos antes (10:37). Si pierdes el bus de las 10:47, el siguiente podría llegar demasiado tarde para el enlace con el City Train.',
        keyDetails: 'Bus Público (FRAM).',
        priceNOK: 48, priceEUR: 4.20, type: 'transport', completed: false, notes: 'CRITICAL',
        routeUrl: `https://www.google.com/maps/dir/?api=1&origin=${COORDS.ALNES_BUS_STOP.lat},${COORDS.ALNES_BUS_STOP.lng}&destination=${COORDS.KORSEGATA_BUS.lat},${COORDS.KORSEGATA_BUS.lng}&travelmode=transit`,
        instagramUrl: 'https://www.instagram.com/explore/tags/alesundnorway/'
    },
    {
        id: '7', title: 'Refrigerio Rápido', startTime: '12:00', endTime: '12:20',
        locationName: 'Centro Ålesund', coords: COORDS.KORSEGATA_BUS,
        description: 'Snack rápido o baño antes del tren.',
        fullDescription: 'Al llegar al centro, tienes unos minutos para un snack rápido o ir al baño antes del tren turístico.',
        tips: 'Algo ligero para aprovechar el tiempo.',
        keyDetails: 'Parada técnica.',
        priceNOK: 100, priceEUR: 9.00, type: 'food', completed: false,
        instagramUrl: 'https://www.instagram.com/explore/tags/alesundsentrum/'
    },
    {
        id: '8', title: 'City Train (Monte Aksla)', startTime: '12:30', endTime: '14:00',
        locationName: 'Parada Tren Turístico', endLocationName: 'Mirador Fjellstua',
        coords: COORDS.KORSEGATA_BUS, endCoords: COORDS.AKSLA_VIEWPOINT,
        description: 'Recorrido guiado y subida al mirador.',
        fullDescription: 'Sube al Tren Turístico. Recorrido guiado de 1h 10m que pasa por el centro y sube al Mirador Fjellstua (sin escaleras). La mejor vista de la ciudad.',
        tips: 'Este tren te ahorra subir los 418 escalones y te lleva directo al mirador.',
        keyDetails: 'Ticket: 330 NOK. Duración 70 min.',
        priceNOK: 330, priceEUR: 29.00, type: 'sightseeing', completed: false,
        ticketUrl: 'https://bytoget.no/',
        instagramUrl: 'https://www.instagram.com/explore/tags/aksla/'
    },
    {
        id: '9', title: 'Paseo Art Nouveau', startTime: '14:00', endTime: '15:30',
        locationName: 'Calle Apotekergata', coords: COORDS.ART_NOUVEAU_CENTER,
        description: 'Arquitectura única y canal Brosundet.',
        fullDescription: 'Camina relajadamente por la calle Apotekergata y el canal Brosundet. Tiempo para compras y fotos finales cerca del barco.',
        tips: 'No te pierdas el Centro Art Nouveau (Jugendstilsenteret) por fuera.',
        keyDetails: 'Paseo libre.',
        priceNOK: 0, priceEUR: 0, type: 'shopping', completed: false,
        instagramUrl: 'https://www.instagram.com/explore/tags/jugendstilsenteret/'
    },
    {
        id: '10', title: 'Regreso al Barco', startTime: '15:30', endTime: '16:00',
        locationName: 'Centro -> Muelle', coords: COORDS.CRUISE_DOCK,
        description: 'Camina hacia el muelle con margen.',
        fullDescription: 'Camina hacia el muelle de cruceros con margen de seguridad.',
        tips: 'Mejor sobrar tiempo que correr.',
        keyDetails: 'Caminata final.',
        priceNOK: 0, priceEUR: 0, type: 'logistics', completed: false,
        instagramUrl: 'https://www.instagram.com/explore/tags/brosundet/'
    },
    {
        id: '11', title: '¡TODOS A BORDO!', startTime: '16:30', endTime: '16:30',
        locationName: 'MSC Euribia', coords: COORDS.CRUISE_DOCK,
        description: 'Hora límite estricta para embarcar.',
        fullDescription: 'Hora límite estricta para embarcar. La pasarela se retira.',
        tips: '¡No llegues tarde!',
        keyDetails: 'CRÍTICO.',
        priceNOK: 0, priceEUR: 0, type: 'logistics', completed: false, notes: 'CRITICAL',
        instagramUrl: 'https://www.instagram.com/explore/tags/msccruises/'
    },
    {
        id: '12', title: 'ZARPA EL BARCO', startTime: '17:00', endTime: '17:00',
        locationName: 'Fiordo', coords: COORDS.CRUISE_DOCK,
        description: 'Disfruta la salida por el fiordo.',
        fullDescription: 'Disfruta la salida por el fiordo desde la cubierta.',
        tips: 'Vistas espectaculares de las islas.',
        keyDetails: 'Navegación.',
        priceNOK: 0, priceEUR: 0, type: 'logistics', completed: false,
        instagramUrl: 'https://www.instagram.com/explore/tags/norwegianfjords/'
    }
];

export const PRONUNCIATIONS: Pronunciation[] = [
    { word: 'Ålesund', phonetic: '/ˈɔːləsʉn/', simplified: 'O-le-sun', meaning: 'Estrecho de la anguila' },
    { word: 'Godøya', phonetic: '/god-øya/', simplified: 'GOD-eu-ia', meaning: 'Isla buena' },
    { word: 'Fjellstua', phonetic: '/fjell-stua/', simplified: 'FYEL-stua', meaning: 'Refugio de montaña' },
    { word: 'Aksla', phonetic: '/aksla/', simplified: 'AKS-la', meaning: 'El hombro (montaña)' },
    { word: 'Jugendstil', phonetic: '/yu-gen-stil/', simplified: 'YU-guen-stil', meaning: 'Art Nouveau' },
    { word: 'Skål', phonetic: '/skoːl/', simplified: 'SKOL', meaning: '¡Salud!' },
    { word: 'Takk', phonetic: '/tak/', simplified: 'TAK', meaning: 'Gracias' },
];

export const BUS_AUDIO_GUIDE: AudioTrack[] = [
    {
        id: 'bus_1',
        title: '1. ¡Listos para la marcha! (Túneles Submarinos)',
        text: "¡Listos para ponernos en marcha! Ahora que estamos a bordo del autobús de la línea 32, acomódense cerca de una ventana. No estamos ante un simple traslado; el camino desde Ålesund hasta el faro es una pequeña maravilla de la ingeniería noruega.\n\nMientras el autobús deja atrás el puerto de cruceros y la estación central, prepárense para sumergirnos... literalmente.\n\nEn breve entraremos en los famosos túneles submarinos. Noruega es un país de islas y montañas, y para no depender de los lentos ferris, decidieron excavar bajo el mar. Primero cruzaremos el Túnel de Ellingsøy, y poco después, el Túnel de Valderøy. Fíjense en la profundidad; en algunos puntos estaremos a casi 150 metros bajo el nivel del mar. Es una sensación curiosa pensar que, justo ahora, toneladas de agua del Atlántico están sobre nuestras cabezas."
    },
    {
        id: 'bus_2',
        title: '2. Isla de Giske y Godøya',
        text: "¡Y salimos a la luz! Bienvenidos a la isla de Giske. Aquí el paisaje cambia. Pasamos de la oscuridad del túnel a cielos abiertos y prados verdes. A su izquierda o derecha, dependiendo de dónde se sienten, verán playas de arena blanca que parecen fuera de lugar en estas latitudes tan al norte.\n\nAhora, miren hacia adelante. Ese puente curvo que ven es el Puente de Giske. Nos lleva a nuestra isla destino: Godøya.\n\nGodøya es fácil de reconocer por su forma de \"sombrero\" montañoso. Pero la aventura no termina al cruzar el puente. Para llegar al faro, el autobús debe atravesar un último obstáculo: la propia montaña. Entraremos en el Túnel de Alnes."
    },
    {
        id: 'bus_3',
        title: '3. El Camino Antiguo y Llegada',
        text: "Una curiosidad sobre este túnel: hasta hace no mucho, la carretera hacia el faro era un camino de tierra estrecho y peligroso que bordeaba el acantilado. Este túnel moderno es lo que ha permitido que hoy podamos visitar esta joya de forma segura y cómoda en cualquier época del año.\n\nAl salir de este último túnel, el paisaje se abrirá de golpe. Ya no hay más islas enfrente, solo el vasto horizonte y, allí a lo lejos, nuestro destino: el Faro de Alnes.\n\nRelájense y disfruten de estos últimos minutos de trayecto entre casas de pescadores y el romper de las olas."
    }
];

export const ALNES_AUDIO_GUIDE: AudioTrack[] = [
    {
        id: 'alnes_1',
        title: '1. Introducción y El Viaje',
        text: "Bienvenidos, viajeros. Si miran hacia el horizonte, donde el mar parece no tener fin, están a punto de conocer uno de los símbolos más queridos de la costa oeste noruega: el Faro de Alnes.\n\nPara llegar aquí, hemos dejado atrás las calles de Ålesund y hemos viajado a través de túneles submarinos y puentes hasta llegar a la isla de Godøya. Fíjense en el paisaje que nos rodea. Ya no estamos protegidos por las tranquilas aguas del interior del fiordo; aquí, estamos a las puertas del Mar de Noruega."
    },
    {
        id: 'alnes_2',
        title: '2. Arquitectura y Resistencia',
        text: "Ante ustedes se alza una estructura inconfundible. A diferencia de muchos faros que son torres redondas de piedra o metal, el Faro de Alnes destaca por su arquitectura de madera y su peculiar forma cuadrada. Sus franjas rojas y blancas no son solo una elección estética; fueron diseñadas para ser vistas claramente por los pescadores entre la densa niebla y la espuma de las olas durante los duros inviernos nórdicos."
    },
    {
        id: 'alnes_3',
        title: '3. Historia (1852 - Hoy)',
        text: "La historia de este lugar se remonta a 1852. Imaginen por un momento la vida aquí hace casi dos siglos. Esta zona era vital para la pesca del arenque y el bacalao, pero también era traicionera. El faro original era modesto, apenas una lámpara de aceite, pero suficiente para guiar a los marineros de vuelta a casa sanos y salvos. La torre que ven hoy se construyó en 1876 y ha sido modernizada con el tiempo, pero su alma permanece intacta.\n\nHoy en día, el faro está totalmente automatizado, pero sigue cumpliendo una doble función: guía para los barcos y refugio cultural para nosotros, los visitantes."
    },
    {
        id: 'alnes_4',
        title: '4. La Experiencia y El Secreto',
        text: "Os invito a acercaros y, si se sienten con energía, a subir las empinadas escaleras de madera hasta la cima de la torre. La recompensa es una vista panorámica de 360 grados: por un lado, las majestuosas montañas de los Alpes de Sunnmøre; por el otro, la inmensidad del océano Atlántico. Es un lugar perfecto para sentir la fuerza de la naturaleza.\n\nY antes de irnos, un pequeño secreto local: no dejen de visitar la antigua casa del farero, justo al lado de la torre. Hoy funciona como una cafetería y galería de arte. Es casi una tradición obligatoria probar sus famosos pasteles caseros o las 'sveler' (una especie de tortita noruega) mientras se refugian del viento."
    },
    {
        id: 'alnes_5',
        title: '5. Despedida',
        text: "El Faro de Alnes no es solo una luz en la oscuridad; es un testimonio de la resistencia y la cultura costera de Noruega. Tómense su tiempo, respiren el aire salado y disfruten de este rincón del mundo donde el cielo se funde con el mar."
    }
];

export const AKSLA_AUDIO_GUIDE: AudioTrack[] = [
    {
        id: 'aksla_1',
        title: '1. La Cima y el Incendio',
        text: "¡Hemos llegado al punto más alto de Ålesund! Deténganse un momento, respiren profundamente y sientan la brisa fresca del fiordo.\n\nEstamos en la cima del Monte Aksla, y las vistas que se despliegan ante nosotros son el mejor testimonio de por qué esta ciudad es considerada una de las más bellas de Noruega.\n\nMiren hacia abajo, hacia la ciudad. Lo primero que salta a la vista es la increíble uniformidad de los edificios. Ålesund no luce como otras ciudades escandinavas de madera. Esto se debe al Gran Incendio de 1904. En una sola noche, casi toda la ciudad fue consumida por las llamas.\n\nEl Plan de Reconstrucción que siguió fue ambicioso: se decidió reconstruir todo en piedra y ladrillo y, sobre todo, en el estilo arquitectónico de moda en Europa en aquel momento: el Art Nouveau, o Jugendstil. Desde aquí, se puede apreciar la riqueza de los detalles: las torres, las agujas, los dragones y las formas orgánicas que cubren los techos. Es como si una ciudad de cuento de hadas hubiera sido plantada en estos islotes.\n\nSi extienden su mirada, verán la forma única en la que la ciudad se extiende sobre varias islas conectadas por puentes:\n\n1. A la derecha, verán el brazo de mar que conduce hacia el interior, hacia los famosos fiordos, como el Geiranger.\n2. Delante de ustedes, la ciudad principal, abrazando el puerto y los canales.\n3. A la izquierda, verán las islas exteriores que visitamos, como Godøya con nuestro Faro de Alnes, y más allá, la inmensidad del Océano Atlántico."
    },
    {
        id: 'aksla_2',
        title: '2. El Mirador Fjellstua',
        text: "Estamos en el mirador principal, Fjellstua. Este es el punto de vista más fotografiado, y por una buena razón. Es el lugar perfecto para identificar las principales características de la ciudad:\n\n• El puerto de Brosundet, que corta el centro de la ciudad.\n• El Puente de la Ciudad (Bybrua), que conecta la isla principal con las demás.\n\nPara aquellos que eligieron la ruta de los valientes y subieron los 418 escalones desde el Parque de la Ciudad, ¡felicitaciones! Acaban de completar el entrenamiento favorito de los habitantes de Ålesund. Para los que optaron por el autobús o taxi, han sido igualmente inteligentes al priorizar el tiempo en la cima.\n\nAntes de que terminemos y se dirijan a tomar algo en el café local, tómense un momento para memorizar esta imagen. Este es un paisaje esculpido por el hielo, el fuego y la mano del hombre."
    }
];

export const ART_NOUVEAU_AUDIO_GUIDE: AudioTrack[] = [
    {
        id: 'art_1',
        title: '1. Terminal y Arquitectura',
        text: "Comenzamos nuestro paseo a pocos pasos del muelle. Mientras avanzamos hacia el corazón de la ciudad, miren a su alrededor. Lo que ven es una de las colecciones de arquitectura Art Nouveau —o Jugendstil, como se conoce en Escandinavia— más puras del mundo.\n\nComo aprendimos, esta uniformidad no es accidental. En 1904, un incendio catastrófico arrasó la ciudad. Cerca de 850 casas de madera fueron destruidas. En su lugar, se levantó esta nueva Ålesund, reconstruida completamente en piedra y ladrillo, siguiendo el estilo artístico europeo de la época."
    },
    {
        id: 'art_2',
        title: '2. Canal Brosundet',
        text: "Ahora nos encontramos ante el Brosundet, el alma de la ciudad. Este estrecho canal divide el centro y es la arteria que ha dado vida a Ålesund durante siglos. Fíjense cómo el agua llega hasta el borde de los edificios.\n\nLas estructuras que flanquean el canal se conocen como Sjøboder o almacenes de mar. Antiguamente, estos edificios de la orilla funcionaban como bodegas de pescado y estaciones de procesamiento. Hoy, muchos han sido reconvertidos en restaurantes, cafés y hoteles boutique, como el famoso Hotel Brosundet, que literalmente tiene uno de sus cimientos directamente en el agua.\n\nSi tienen suerte, verán pequeños barcos pesqueros amarrados que aún entregan su pesca fresca aquí, manteniendo vivo el legado marítimo de la ciudad."
    },
    {
        id: 'art_3',
        title: '3. Desvelando el Art Nouveau',
        text: "A medida que caminamos, los invito a dejar de ver los edificios como un todo y a concentrarse en los detalles. El Art Nouveau rechazaba la uniformidad industrial y celebraba las formas de la naturaleza.\n\nBusquen estos elementos en las fachadas:\n\n• Líneas Curvas y Orgánicas: A diferencia de la arquitectura recta y geométrica, verán arcos fluidos, formas que imitan las olas, las algas o las enredaderas.\n• Torres y Agujas Asimétricas: Miren hacia arriba. Cada edificio tiene un remate diferente. Hay pequeñas torres puntiagudas y miradores que rompen la simetría de la fachada, creando una sensación de cuento de hadas.\n• Motivos Nórdicos y de Dragones: Presten atención a los ornamentos en las cornisas y las entradas. Muchos arquitectos noruegos se inspiraron en la antigua mitología nórdica y en el estilo Dragestil vikingo, incorporando cabezas de dragón y serpientes entrelazadas."
    },
    {
        id: 'art_4',
        title: '4. Farmacia del Cisne',
        text: "Deténganse aquí, frente al edificio más icónico de la ciudad: la antigua Farmacia del Cisne (Svaneapoteket). Este magnífico edificio no solo es un ejemplo perfecto del Jugendstil, sino que hoy alberga el Centro Art Nouveau (Jugendstilsenteret) y el Museo de Arte KUBE.\n\nEs el lugar ideal para profundizar en la historia. Si deciden visitarlo, verán cómo era la vida en el interior de estos edificios a principios del siglo XX y la dramática historia del fuego y la reconstrucción.\n\nDesde el canal hasta esta farmacia, cada paso en Ålesund es una lección de resiliencia y belleza arquitectónica. Disfruten de la caminata, busquen sus detalles favoritos y dejen que el espíritu Art Nouveau los envuelva."
    }
];