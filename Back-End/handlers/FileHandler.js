fs = require('fs')
const mkdirp = require('mkdirp');
const { Client } = require('node-scp')
const aws = require('aws-sdk')
const dotenv = require('dotenv').config()


class FileHandler {

    async AddProductPictures(fotografias){

        let links_fotografias = []

        try {
            for (const fotografia of fotografias) {
                if (fotografia.mimetype == "image/jpeg" || fotografia.mimetype == "image/png") {

                    let extension
            
                    if (fotografia.mimetype == "image/jpeg") {
                        extension = ".jpg"
                    }
            
                    if (fotografia.mimetype == "image/png") {
                        extension = ".png"
                    }
                    
                    const buffer = fotografia.buffer
                    
                    let filename = Date.now().toString(36) + Math.random().toString(36).substring(2);

                    let file_path_return = await this.uploadImage("produto", buffer, (filename + extension), fotografia.mimetype)
                    
                    links_fotografias.push(file_path_return)
                } else {
                    throw({
                        code: 400,
                        message: "Fotografia deve ser .png ou .jpg"
                    })
                }
            }
        } catch (err) {
            throw err
        }

        return links_fotografias
    }   

    async AddProdutoPictureFS(fotografias, nomes_fotografias) {

        let links_fotografias

        for (let x = 0; x < fotografias.length; x++) {

            let nome_fotografia = nomes_fotografias[x]

            nome_fotografia = nome_fotografia.split(".")
            let extensao = nome_fotografia[nome_fotografia.length - 1]
            extensao = "." + extensao

            let mime
            if (extensao == ".png") {
                mime = "image/png"
            } else if (extensao == ".jpg" || extensao == ".jpeg") {
                mime = "image/jpeg"
            }

            let fotografia = fotografias[x]

            const buffer = fotografia
                    
            let filename = Date.now().toString(36) + Math.random().toString(36).substring(2);

            let file_path_return = await this.uploadImage("subcategoria", buffer, (filename + extensao), mime)
            
            links_fotografias.push(file_path_return)
        }

        return links_fotografias
        

    }
    
    async AddCategoriaPicture(fotografia){

        let link_fotografia

        try {

            if (fotografia.mimetype == "image/jpeg" || fotografia.mimetype == "image/png") {

                let extension
        
                if (fotografia.mimetype == "image/jpeg") {
                    extension = ".jpg"
                }
        
                if (fotografia.mimetype == "image/png") {
                    extension = ".png"
                }
                
                const buffer = fotografia.buffer
                
                let filename = Date.now().toString(36) + Math.random().toString(36).substring(2);

                let file_path_return = await this.uploadImage("categoria", buffer, (filename + extension), fotografia.mimetype)
                
                link_fotografia = file_path_return
            } else {
                throw({
                    code: 400,
                    message: "Fotografia deve ser .png ou .jpg"
                })
            }

        } catch (err) {
            throw err
        }

        return link_fotografia
    }   

    async AddCategoriaPictureFS(fotografia) {

        let link_fotografia

        try {

            const buffer = fotografia
                
            let filename = Date.now().toString(36) + Math.random().toString(36).substring(2);

            let file_path_return = await this.uploadImage("categoria", buffer, (filename + ".jpg"), "image/jpeg")
            
            link_fotografia = file_path_return

        } catch (err) {
            throw err
        }

        return link_fotografia

    }

    async AddSubCategoriaPicture(fotografia){

        try {
            if (fotografia.mimetype == "image/jpeg" || fotografia.mimetype == "image/png") {

                let extension
        
                if (fotografia.mimetype == "image/jpeg") {
                    extension = ".jpg"
                }
        
                if (fotografia.mimetype == "image/png") {
                    extension = ".png"
                }
                
                const buffer = fotografia.buffer
                
                let filename = Date.now().toString(36) + Math.random().toString(36).substring(2);

                let file_path_return = await this.uploadImage("subcategoria", buffer, (filename + extension), fotografia.mimetype)
                
                link_fotografia = file_path_return
            } else {
                throw({
                    code: 400,
                    message: "Fotografia deve ser .png ou .jpg"
                })
            }
        } catch (err) {
            throw err
        }

        return link_fotografia
    }   

    async AddSubCategoriaPictureFS(fotografia) {

        let link_fotografia

        try {

            const buffer = fotografia
                
            let filename = Date.now().toString(36) + Math.random().toString(36).substring(2);

            let file_path_return = await this.uploadImage("subcategoria", buffer, (filename + ".png"), "image/png")
            
            link_fotografia = file_path_return

        } catch (err) {
            throw err
        }

        return link_fotografia

    }

    async AddProdutoEspecificoPictures(fotografias){

        let links_fotografias = []

        try {
            for (const fotografia of fotografias) {
                if (fotografia.mimetype == "image/jpeg" || fotografia.mimetype == "image/png") {

                    let extension
            
                    if (fotografia.mimetype == "image/jpeg") {
                        extension = ".jpg"
                    }
            
                    if (fotografia.mimetype == "image/png") {
                        extension = ".png"
                    }
                    
                    const buffer = fotografia.buffer
                    
                    let filename = Date.now().toString(36) + Math.random().toString(36).substring(2);

                    let file_path_return = await this.uploadImage("produto_especifico", buffer, (filename + extension), fotografia.mimetype)
                    
                    links_fotografias.push(file_path_return)
                } else {
                    throw({
                        code: 400,
                        message: "Fotografia deve ser .png ou .jpg"
                    })
                }
            }
        } catch (err) {
            throw err
        }

        return links_fotografias
    }  

    async uploadImage(tipo, stream, key, mimetype) {
        aws.config.setPromisesDependency()
        aws.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
        })

        let s3 = new aws.S3()
        
        let bucket = 'baylit-images/'+tipo
        var params = {Bucket: bucket, Key: key, ContentType: mimetype, Body: stream};
        let image = await s3.upload(params).promise()
        return image.Location
    }
}

module.exports = {
    file_handler: new FileHandler()
}