import { Component } from '@angular/core';
import { NavController,Platform,LoadingController,IonSlides,ToastController,ModalController } from '@ionic/angular';
import { ServerService } from '../service/server.service';
import { ActivatedRoute } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subscription',
  templateUrl: 'subscription.page.html',
  styleUrls: ['subscription.page.scss'],
})
export class SubscriptionPage {

data:any;
text:any;
total_amount:any;
constructor(public loadingController: LoadingController,public server : ServerService,private route: ActivatedRoute,public nav : NavController,public toastController: ToastController,public modalController: ModalController) {

this.text = JSON.parse(localStorage.getItem('app_text'));

}

ionViewWillEnter()
{
  if(!localStorage.getItem('user_id') || localStorage.getItem('user_id') == 'null')
  {
    this.nav.navigateRoot('/login');

    this.presentToast("Please login for access your profile");
  }
  else
  {
    this.loadData();
  }
}
async loadData()
{
  const loading = await this.loadingController.create({
    message: 'Please wait...',
    mode:'ios'
    });
    await loading.present();
    this.server.subscriptionInfo(localStorage.getItem('user_id')).subscribe((response:any) => {
  
      this.data = response.data;
      //console.log("Msg"+response[0].msg);
      if(response[0].msg == "done")
    {
      this.presentToast("You are a subscribed user!");
      this.nav.navigateRoot('home'); 
      loading.dismiss();
    }
      else
    {
      this.server.getSubscription().subscribe((response:any) => {
        this.data = response.data;
        loading.dismiss();
    
        });
    }  
      });
    
   /* this.server.getSubscription().subscribe((response:any) => {
    console.log("Response"+response.data);
    this.data = response.data;
    loading.dismiss();

    }); */
  }

  async applyNow(cdata)
  {
    await this.modalController.dismiss({id:cdata});
  }

  async closeModal() {
    
    await this.modalController.dismiss({id:false});
  }
  
  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : 'top',
      mode:'ios',
      color:'dark'
    });
    toast.present();
  }

}
