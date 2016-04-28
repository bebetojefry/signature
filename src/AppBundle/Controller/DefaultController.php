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
        // replace this example code with whatever you need
        return $this->render('AppBundle:Default:index.html.twig');
    }

    /**
     * @Route("/save", name="save_signature")
     */
    public function saveAction(Request $request) {
        // save image to folder
        $data_uri = $request->get('sign');
        $encoded_image = explode(",", $data_uri)[1];
        $decoded_image = base64_decode($encoded_image);
        $file = "assets/signatures/" . time() . ".png";
        file_put_contents($file, $decoded_image);
        
        // save image to DB
        $em = $this->getDoctrine()->getEntityManager();
        $sign = new Sign($request->get('name'), $request->get('sign'));
        $em->persist($sign);
        $em->flush();
        
        return new Response('Signature saved successfully.');
    }    

}
