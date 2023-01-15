<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Office365\Runtime\Auth\ClientCredential;
use Office365\SharePoint\ClientContext;
use Office365\SharePoint\FileCreationInformation;

class SchoolDocs
{
    private $clientId = "70170cae-3932-4211-a4a8-5c52e1a32eca";
    private $clientSecret = "x6yTE2K5RrKarOZ/GkYii7VGde4ylgdTcDvxn65f5XY=";
    private $credentials;
    private $client;
    private $web;
    private $targetLibraryTitle;
    private $targetList;

    public function __construct()
    {
        try {
            //1. Initialize SharePoint client with user credentials
            $this->credentials = (new ClientCredential($this->clientId, $this->clientSecret));
			echo
            $this->client = (new ClientContext("https://data2information.sharepoint.com/sites/TestSite-Renee"))->withCredentials($this->credentials);

            $site = $this->client->getSite();
            $this->client->load($site, ["RootWeb", "Url"]); //2. load Site resource
            $this->client->executeQuery();  //3. submit query to the server
            $this->targetLibraryTitle = "Shared Documents/Private District Files";
            $this->targetList = $this->client->getWeb()->getLists()->getByTitle($this->targetLibraryTitle);
        } catch (Exception $e) {
            echo 'Authentication failed: ',  $e->getMessage(), "\n";
        }
    }

    public function uploadFile($file_id, $folderName)
    {
        $file = get_attached_file( $file_id );
        $fileName = basename($file);
        $fileCreationInformation = new FileCreationInformation();
        $fileCreationInformation->Content = file_get_contents($file);
        $fileCreationInformation->Url = $fileName;
        try {
            //code...
            $uploadFile = $this->client
                ->getWeb()
                ->getFolderByServerRelativeUrl($this->targetLibraryTitle . '/' . $folderName)
                ->getFiles()
                ->add($fileCreationInformation)
                ->executeQuery();
            return "File saved successfully.";
        } catch (Exception $e) {
            //throw $th;
            return 'File upload failed: ' . $e->getMessage() . "\n";
        }
    }

    private function checkFolderExists($folder)
    {
        $folder = $this->client->getWeb()->getFolderByServerRelativeUrl($folder)->select(["Exists"])->get()->executeQuery();
        return $folder->getExists();
    }

    private function createFolder($folderName)
    {
        $rootFolder = $this->client->getWeb()->getFolderByServerRelativeUrl("Shared Documents");
        $newFolder = $rootFolder->getFolders()->add($folderName)->executeQuery();
        return $newFolder->getServerRelativeUrl();
    }
}

// $x = new Sharepoint();
