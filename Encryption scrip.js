function check(){
const messaggio_da_cifrare = document.getElementById("testo_da_cifrare").value;
const chiave = document.getElementById("password").value;

if(confirm("vuoi continuare?")){
    startencryption(messaggio_da_cifrare, chiave);
}
}
function startencryption(messaggio_da_cifrare, chiave){
    console.log("enrcryption started");
    let testoCifrato = CryptoJS.AES.encrypt(messaggio_da_cifrare, chiave).toString() + "$$$STOP$$$";
    let binary_message = binary_conversion(testoCifrato);
    prepare_canvas(binary_message);
}
function binary_conversion(testoCifrato){
    let msg_binary = [];
    for(let i=0; i< testoCifrato.length; i++ ){
        let letter = testoCifrato.charCodeAt(i);
        let binary_letter= letter.toString(2).padStart(8, '0');
        let letter_split= binary_letter.split('');
        msg_binary.push(letter_split);
    }
    return msg_binary;
}
function prepare_canvas(binary_message){
    const canvas = document.getElementById('modified_pic');
    const ctx = canvas.getContext('2d');
    const img = document.getElementById('starting_pic');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    const image_data= ctx.getImageData(0, 0, img.width, img.height);
    const pixel= image_data.data;

    console.log(pixel);
    let value_counter = 0;

    for(let i = 0;i < binary_message.length; i++){
        let local_byte = binary_message[i];
        
        for(let j=0; j < 8; j++){
            let local_bit = local_byte[j];
            let LSV_pos = value_counter * 4;
            let LSV = pixel[LSV_pos];
            if(local_bit === '0'){
                if((LSV % 2) !== 0){
                    LSV--;
                }}
                else{
                    if((LSV % 2) == 0){ 
                        if(LSV === 255 ){
                            LSV--;
                        }
                    else{
                        LSV++;
                    }
                }
            }
             pixel[LSV_pos]= LSV;
        value_counter ++;
        }
    }
    ctx.putImageData(image_data, 0, 0);
    console.log("Dati nascosti con successo! Immagine steganografata pronta.");
    window.scrollTo({
    top: 500,
    left: 0,
    behavior: 'smooth'
    });
}
function download(){
    const canvas = document.getElementById('modified_pic');
    
    const imageURL = canvas.toDataURL("image/png");
    
    // 2. Crea un elemento <a> (un link) invisibile
    const link = document.createElement('a');
    
    link.href = imageURL;
    link.download = "messaggio_segreto.png";
    
    //simula il clic
    link.click();
}