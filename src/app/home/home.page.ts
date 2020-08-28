import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../service/server.service';
import { NavController, Platform, LoadingController, IonSlides, Events } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { OptionPage } from '../option/option.page';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  BannerOption = {
    initialSlide: 0,
    slidesPerView: 2.3,
    loop: true,
    centeredSlides: false,
    autoplay: false,
    speed: 500,
    spaceBetween: 7,

  }

  SearchOption = {
    initialSlide: 0,
    slidesPerView: 3.5,
    loop: false,
    centeredSlides: false,
    autoplay: false,
    speed: 500,
    spaceBetween: -20,

  }

  TrendOption = {
    initialSlide: 0,
    slidesPerView: 1.4,
    loop: true,
    centeredSlides: false,
    autoplay: false,
    speed: 800,
    spaceBetween: -9,

  }

  MiddleBannerOption = {
    initialSlide: 0,
    slidesPerView: 1.3,
    loop: false,
    centeredSlides: false,
    autoplay: true,
    speed: 800,
    spaceBetween: 7,

  }

  city_name: any;
  data: any;
  fakeData = [1, 2, 3, 4, 5, 6, 7];
  oldData: any;
  showLoading = false;
  filterPress: any;
  hasSearch = false;
  searchQuery: any;
  count: any;
  text: any;
  order: any;
  itemss = [];
  cart: any = [];

  pet: number = 0;
  veg = false;
  cart_no: any;
  menu: any = []
  item: any = []
  fine: any = []
  constructor(public server: ServerService,
    private nav: NavController,
    public modalController: ModalController,
    public toastController: ToastController,
    public events: Events) {

  }

  ionViewWillEnter() {
    if (localStorage.getItem('app_text')) {
      this.text = JSON.parse(localStorage.getItem('app_text'));
    }

    this.city_name = localStorage.getItem('city_name');

    this.server.cartCount(localStorage.getItem('cart_no') + "?user_id=" + localStorage.getItem('user_id')).subscribe((response: any) => {

      this.count = response.data;
      this.order = response.order;

    });

    this.loadData(localStorage.getItem('city_id') + "?ss=ss");

    if (localStorage.getItem('cart_no') == 'null' || localStorage.getItem('cart_no') == undefined) {
      this.cart_no = Math.floor(Math.random() * 2000000000) + 1;

      localStorage.setItem('cart_no', this.cart_no);
    }
    else {
      this.cart_no = localStorage.getItem('cart_no');
    }

    this.server.cartCount(this.cart_no).subscribe((response: any) => {

      this.count = response.data;
      this.cart = response.cart;


    });

  }

  ngOnInit() {
    this.searchQuery = null;
    this.hasSearch = false;
  }

  nearBy() {
    this.data = null;
    this.loadData(localStorage.getItem('city_id') + "?lat=" + localStorage.getItem('current_lat') + "&lng=" + localStorage.getItem('current_lng'));
  }

  async loadData(city_id) {
    var lid = localStorage.getItem('lid') ? localStorage.getItem('lid') : 0;

    this.server.homepage(city_id + "&lid=" + lid).subscribe((response: any) => {

      this.data = response.data;
      this.text = response.data.text;

      this.events.publish('text', this.text);
      this.events.publish('admin', response.data.admin);

      localStorage.setItem('app_text', JSON.stringify(response.data.text));
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      const deo = this.data.store;

      deo.forEach(element => {
        this.itemss.push(element.items);
      });
    });
    console.log(this.itemss)
  }

  search(ev) {
    var val = ev.target.value;
    if (val && val.length > 0) {
      this.data = null;
      this.hasSearch = val;

      this.loadData(localStorage.getItem('city_id') + "?q=" + val);
    }
    else {
      this.ngOnInit();
      this.hasSearch = false;
    }
  }

  async dataFilter(type) {
    this.filterPress = type;
    await this.delay(1000);
    this.filterPress = null;

    if (type == 1) {
      this.data.store.sort((a, b) => {

        return parseFloat(b.discount_value) - parseFloat(a.discount_value);

      });
    }
    else if (type == 2) {
      this.data.store.sort((a, b) => {

        return parseFloat(a.delivery_time) - parseFloat(b.delivery_time);

      });
    }
    else if (type == 3) {
      this.data.store.sort((a, b) => {

        return parseFloat(b.trending) - parseFloat(a.trending);

      });
    }
    else if (type == 4) {
      this.data.store.sort((a, b) => {

        return parseFloat(b.id) - parseFloat(a.id);

      });
    }
    else if (type == 5) {
      this.data.store.sort((a, b) => {

        return parseFloat(b.rating) - parseFloat(a.rating);

      });
    }
    else if (type == 6) {

    }
    else if (type == 7) {

    }
  }

  async delay(ms: number) {

    return new Promise(resolve => setTimeout(resolve, ms));
  }

  bannerLink(offer) {
    if (offer.link) {
      this.data = null;
      this.loadData(localStorage.getItem('city_id') + "?banner=" + offer.id);
    }
  }

  doRefresh(event) {

    this.loadData(localStorage.getItem('city_id'));

    setTimeout(() => {

      event.target.complete();
    }, 2000);
  }

  itemPage(storeData) {
    if (storeData.open) {
      localStorage.setItem('menu_item', JSON.stringify(storeData));

      this.nav.navigateForward('/item');
    }
  }

  searchPage(data) {
    if (data.store_id) {
      this.nav.navigateForward('/item');
    }
  }
  vegOnly()
  {
  	this.veg = this.veg == true ? false : true;
  }

  async showOption(item,currency) {
    const modal = await this.modalController.create({
      component: OptionPage,
      animated:true,
      mode:'ios',
      cssClass: 'my-custom-modal-css',
      backdropDismiss:false,
      componentProps: {
      'item': item,
      'currency' : currency
    }

    });

   modal.onDidDismiss().then(data=>{
      
      if(data.data.id)
      {
        this.addToCart(data.data.id,data.data.price,data.data.type,data.data.addonData); 
      }

    })

    return await modal.present();
  }

  addToCart(id,price,type = 0,addon = [])
  {
    this.presentToast("Added Successfully");

     var allData = {cart_no : this.cart_no, id : id,price : price,qtype : type,type:0,addon : addon};

     this.server.addToCart(allData).subscribe((response:any) => {

      this.count = response.data.count;
      this.cart  = response.data.cart;


     });
  }

  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 2000
    });
    toast.present();
  }

  hasCart(id)
  {
    for(var i =0;i<this.cart.length;i++)
    {
      if(this.cart[i].item_id == id)
      {
        return this.cart[i].qty;
      }
    }

    return false;
  }

  async updateCart(id,type = 0)
  { 
    this.presentToast("Removed Successfully");

    this.server.updateCart(id,type+"?cart_no="+this.cart_no+"&lid="+localStorage.getItem('lid')).subscribe((response:any) => {
    
    this.cart = response.data;
    
    });
  }

}
