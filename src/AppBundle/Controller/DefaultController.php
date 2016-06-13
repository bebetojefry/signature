<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Entity\Sign;

class DefaultController extends Controller {

    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request) {
        $signs = $this->getDoctrine()->getRepository('AppBundle:Sign')->findAll();
        return $this->render('AppBundle:Default:index.html.twig', array('signs' => $signs));
    }

    /**
     * @Route("/save", name="save_signature")
     */
    public function saveAction(Request $request) {
        // save image to folder
        /*
        $data_uri = $request->get('sign');
        $encoded_image = explode(",", $data_uri)[1];
        $decoded_image = base64_decode($encoded_image);
        $file = "assets/signatures/" . time() . ".png";
        file_put_contents($file, $decoded_image);
        */
        
        // save image to DB
        $em = $this->getDoctrine()->getEntityManager();
        $sign = new Sign($request->get('name'), $request->get('sign'));
        $em->persist($sign);
        $em->flush();
        
        return new Response('Signature saved successfully.');
    }    
    
    /**
     * @Route("/preview", name="preview")
     */
    public function previewAction(Request $request) {
//        $pdf_file   = "pdf/pdf.pdf[$page]";
//        
//        $img = new \imagick($pdf_file);
//        $img->setImageFormat('jpg');
//        $img->setImageUnits(\imagick::RESOLUTION_PIXELSPERINCH);
//        $img->setImageResolution(1500,1500);
//        //$img->setimagecompressionquality($quality);
//
//        $response = new Response($img->getimageblob(), 200);
//        
//        $img->clear();
//        $img->destroy();
//        
//        $response->headers->set('Content-Type', 'image/jpg');
//        return $response;
        
        return $this->render('AppBundle:Default:preview.html.twig');
    }
    
    /**
     * @Route("/pdf", name="pdf")
     */
    public function pdfAction(Request $request) {
        return $this->render('AppBundle:Default:pdf.html.twig');
    }

}
