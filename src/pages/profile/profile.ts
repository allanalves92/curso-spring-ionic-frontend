import { API_CONFIG } from "./../../config/api.config";
import { ClienteService } from "./../../services/domain/cliente.service";
import { ClienteDTO } from "./../../models/cliente.dto";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { StorageService } from "../../services/storage.service";
import { Camera, CameraOptions } from "@ionic-native/camera";

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  cliente: ClienteDTO;
  picture: string;
  cameraOn: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public camera: Camera
  ) {}

  ionViewDidLoad() {
    this.loadData();
  }

  getImageIfExists() {
    this.clienteService.getImageFromBrucket(this.cliente.id).subscribe(
      response => {
        this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${
          this.cliente.id
        }.jpg`;
      },
      error => {}
    );
  }

  loadData() {
    let localUser = this.storage.getLocalUser();

    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email).subscribe(
        response => {
          this.cliente = response as ClienteDTO;
          this.getImageIfExists();
        },
        error => {
          if (error.status == 403) {
            this.navCtrl.setRoot("HomePage");
          }
        }
      );
    }
  }

  getCameraPicture() {
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.picture = "data:image/png;base64," + imageData;
        this.cameraOn = false;
      },
      err => {}
    );
  }

  getGalleryPicture() {
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.picture = "data:image/png;base64," + imageData;
        this.cameraOn = false;
      },
      err => {}
    );
  }

  sendPicture() {
    this.clienteService.uploadPicture(this.picture).subscribe(
      response => {
        this.picture = null;
        this.loadData();
      },
      error => {}
    );
  }

  cancel() {
    this.picture = null;
  }
}
