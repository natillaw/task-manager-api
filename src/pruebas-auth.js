const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const passwordCorrecta = 'miClave123';
const passwordIncorrecta = 'otraClave456';
const saltRounds = 10;
const jwtSecret = 'clave-secreta-para-pruebas';

function imprimirTitulo(titulo) {
  console.log('\n========================================');
  console.log(titulo);
  console.log('========================================');
}

function verificarToken(nombre, token) {
  try {
    const payload = jwt.verify(token, jwtSecret);
    console.log(`${nombre}: token valido`);
    console.log(payload);
  } catch (error) {
    console.log(`${nombre}: token invalido`);
    console.log(`${error.name}: ${error.message}`);
  }
}

async function ejecutarPruebasAuth() {
  imprimirTitulo('1. HASHEAR UNA CONTRASENA');

  const hash1 = await bcrypt.hash(passwordCorrecta, saltRounds);
  const hash2 = await bcrypt.hash(passwordCorrecta, saltRounds);
  const hash3 = await bcrypt.hash(passwordCorrecta, saltRounds);

  console.log('Password original:', passwordCorrecta);
  console.log('Salt rounds:', saltRounds);
  console.log(
    'Salt rounds es el costo del hash. En bcrypt, 10 significa 2^10 rondas internas: mientras mas alto, mas tarda y mas cuesta atacarlo por fuerza bruta.',
  );

  console.log('\nHashes generados con la misma password:');
  console.log('Hash 1:', hash1);
  console.log('Hash 2:', hash2);
  console.log('Hash 3:', hash3);
  console.log('Los hashes son iguales?', hash1 === hash2 && hash2 === hash3);
  console.log(
    'No salen iguales porque bcrypt genera un salt aleatorio nuevo cada vez. Ese salt queda incluido dentro del hash.',
  );

  imprimirTitulo('2. COMPARAR CONTRASENA CONTRA SU HASH');

  const resultadoCorrecto = await bcrypt.compare(passwordCorrecta, hash1);
  const resultadoIncorrecto = await bcrypt.compare(passwordIncorrecta, hash1);

  console.log('Password correcta:', passwordCorrecta);
  console.log('Password incorrecta:', passwordIncorrecta);
  console.log('Hash guardado:', hash1);

  console.log(
    '\nUn hash no se desencripta. bcrypt compara el texto plano contra el hash usando bcrypt.compare().',
  );

  console.log('\nResultado con password correcta:', resultadoCorrecto);
  console.log('Resultado con password incorrecta:', resultadoIncorrecto);

  imprimirTitulo('3. GENERAR UN TOKEN JWT');

  const datosUsuario = {
    userId: 123,
    role: 'admin',
  };

  const token = jwt.sign(datosUsuario, jwtSecret, { expiresIn: '1h' });

  console.log('Datos dentro del token:', datosUsuario);
  console.log('Clave secreta usada para firmar:', jwtSecret);
  console.log('Expira en: 1h');
  console.log('\nToken JWT:');
  console.log(token);
  console.log('\nPuedes pegar este token en https://jwt.io para ver su header y payload.');

  imprimirTitulo('4. VERIFICAR UN TOKEN');

  verificarToken('Token real', token);
  verificarToken('Texto inventado', 'esto-no-es-un-token-valido');
}

ejecutarPruebasAuth().catch((error) => {
  console.error('Error al ejecutar las pruebas de autenticacion:');
  console.error(error.message);
  process.exit(1);
});
