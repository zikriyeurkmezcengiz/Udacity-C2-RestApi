import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles,isValidImageUrl} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());



  app.get("/filteredimage", async (req, res) => {
    let { image_url } = req.query;
  
    if (!image_url) {
      return res.status(400).send("image_url is required");
    }
  
    const isImageUrlValid = await isValidImageUrl(image_url);
    if (!isImageUrlValid) {
      return res.status(422).send("image_url is not valid");
    }
  
    try {
      const filtered_image_path = await filterImageFromURL(image_url);
      res.sendFile(filtered_image_path, (error) => {
        deleteLocalFiles([filtered_image_path]);
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Couldnt process image");
    }
  });
  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();