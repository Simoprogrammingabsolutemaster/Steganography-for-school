function Img_load(){
    let password = document.getElementById("password_decrypt").value;
    let img_imput = document.getElementById("image_decrypt");

    if(img_imput.files.length === 0){
        alert("Per favore, seleziona un'immagine.");
        return;
    }

    let file = img_imput.files[0];
    let reader = new FileReader();

    reader.onload = function(e){
        let img = new Image();
        img.onload = function(){
            let canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data;

            console.log("Starting decryption...");
            let msg_to_decrypt=Decrypt(password, data);
            finalDecryption(msg_to_decrypt,password);

    }
        img.src = e.target.result; 
}
    reader.readAsDataURL(file);
}

function Decrypt(password, data){
    let red = 0;
    let red_pos = 0;
    let bit;
    let msg_still_encrypted = "";
    let msg_freed= "";
    for(let i = 0; i < data.length; i++){
        let char = [];

        for(let j = 0; j < 8; j++){
        
        red = red_pos*4;
        let pixel = data[red];

        if(pixel % 2 === 0){
            bit = 0;
        }else{
            bit = 1;
        }
        char.push(bit);
        red_pos ++;
    }

    let byte = char.join("");
    let ascii = parseInt(byte, 2);
    let letter = String.fromCharCode(ascii);

    msg_still_encrypted += letter;
    if(msg_still_encrypted.endsWith("$$$STOP$$$")){
        console.log(msg_still_encrypted);
        break;
    }
    }

    msg_freed = msg_still_encrypted.replace("$$$STOP$$$", "");
    return msg_freed;
}
function finalDecryption(msg_to_decrypt, password){

    let msg_decrypted_hex = CryptoJS.AES.decrypt(msg_to_decrypt, password);
    let msg_decrypted = msg_decrypted_hex.toString(CryptoJS.enc.Utf8)
    console.log(msg_decrypted);
    document.getElementById("decrypted").innerText ="Il messaggio è: " + msg_decrypted;
}