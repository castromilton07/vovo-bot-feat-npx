const wa = require('@open-wa/wa-automate'); /* https://docs.openwa.dev/classes/api_Client.Client.html */
const jimp = require('jimp'); /* https://www.npmjs.com/package/jimp */
const pensadorAPI = require('pensador-api') /* https://github.com/operfildoluiz/pensador-api */

const authors = require('./authors.json');

const getImageURL = () => {
    return `https://picsum.photos/400/400?random=${Math.random()}`;
}

const getImageBase64 = async () => {
    const urlImage = getImageURL();
    const image = await jimp.read(urlImage);
    const base64 = await image.getBase64Async(jimp.MIME_JPEG);

    return base64;
}

const getRamdomAuthor = () => {
    return authors[parseInt(Math.random() * authors.length)];
}

const getRamdomText = async () => {
    const pensador = getRamdomAuthor();
    console.log(pensador);
    const { phrases } = await pensadorAPI({ term: pensador, max: 10 });
    const { text } = phrases[parseInt(Math.random() * phrases.length)]
    return text;
}

const sendMessage = async () => {
    const client = await wa.create(); // Create WA client

    const image = await getImageBase64(); // Get image and convert to base64

    const text = await getRamdomText() // get a random text

    const contacts = (await client.getAllContacts()).filter(c => c.name === "Costa e baicepis");

    contacts.forEach(c => {
        client.sendFile(c.id, image, 'bom dia.jpg', text);
    });
}

sendMessage();