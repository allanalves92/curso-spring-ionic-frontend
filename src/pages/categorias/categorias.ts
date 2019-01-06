import { CategoriaDTO } from "./../../models/categoria.dto";
import { CategoriaService } from "./../../services/domain/categoria.service";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { API_CONFIG } from "../../config/api.config";

@IonicPage()
@Component({
  selector: "page-categorias",
  templateUrl: "categorias.html"
})
export class CategoriasPage {
  items: CategoriaDTO[];
  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public categoriaService: CategoriaService,
    public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    let loader = this.presentLoading();
    this.categoriaService.findAll().subscribe(
      response => {
        loader.dismiss();
        this.items = response;
      },
      error => {}
    );
  }

  showProdutos(categoria_id: string) {
    this.navCtrl.push("ProdutosPage", { categoria_id: categoria_id });
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }
}
