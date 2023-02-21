<script setup>
  import {getAPIUrl,addAuthorizationRequestConfig,addAuthorizationRequestConfigWithBlob} from "./integration/Integration";
</script>
<script>
import termometro from "bootstrap-icons/icons/thermometer-half.svg";
import droplet from "bootstrap-icons/icons/droplet.svg";
import cloudRain from "bootstrap-icons/icons/cloud-rain.svg";
import sun from "bootstrap-icons/icons/sun.svg";
import speedometer from "bootstrap-icons/icons/speedometer.svg";
import compass from "bootstrap-icons/icons/compass.svg";
import wind from "bootstrap-icons/icons/wind.svg";
import axios from "axios";
  export default {
    props: ['config'],
    data() {
      return {
        title: null,
        hum: "",
        temp: "",
        wind_speed: "",
        wind_gust: "",
        wind_dir: "",
        rain: "",
        uvi: 0,
        crowdLevel: 0,
        color:"",
        date: "",
        source: null,
        city: "",
        lang: navigator.language,
        termIcons: termometro,
        dropletIcon: droplet,
        cloud_rainIcon: cloudRain,
        sunIcon: sun,
        windIcon: wind,
        compassIcon: compass,
        speedometerIcon: speedometer,

        idLang: 0,
        dict: [
          {
            "crowdLevel": "Crowdedness Level",
            "env": "Environment",
            "wind": "Wind",
            "speed": "knots",
            "uv": "UV Index",
            "city": "Metropolitan city of"
          },
          {
            "crowdLevel": "Affollamento al",
            "env": "Ambiente",
            "wind": "Vento",
            "speed": "nodi",
            "uv": "Indice UV",
            "city": "Città Metropolitana di"
          }
        ]
      }
    },
    mounted() {
      
      if(this.lang.includes("it")) {
        this.idLang = 1;
      }

      axios.get(`http://localhost:8081/api/station/info`, addAuthorizationRequestConfig()).then((res) => {
          console.log(res);
          if (res) {
            this.title = res.data.stationName;
            this.city = res.data.stationLocation;
          }else{
            console.log(error.message);
          }
      });

      axios.get(`http://localhost:8081/api/station/lastSensorValue`, addAuthorizationRequestConfig()).then((res) => {
        console.log(res);
          if (res) {
            this.temp = res.data.temp;
            this.hum = res.data.hum;
            this.wind_speed = res.data.wind_speed;
            this.wind_gust = res.data.wind_gust;
            this.wind_dir = res.data.wind_dir;
            this.rain = res.data.rain;
            this.uvi = this.convertUvVal(parseFloat(res.data.uvi));
            this.temp = res.data.temp;
            var crowd = res.data.crowd_1;
            if(crowd < 0.5) {
              this.color = "green-sem";
            } else if(crowd >= 0.5 && crowd < 1.5) {
              this.color = "yellow-sem";
            } else {
              this.color = "red-sem";
            }

            if(crowd <= 1.25 && crowd >= 0.75) {
              this.crowdLevel = 50;
            } else {
              if(crowd > 1.75) {
                this.crowdLevel = 100;
              }
              else{
                if(crowd < 0.25){
                  this.crowdLevel = 0;
                }
                else{
                  if(crowd>=0.25 && crowd < 0.75){
                    this.crowdLevel=25;
                  }
                  else{
                    this.crowdLevel=75;
                  }
                }
              }
            }
            
            
          }else{
            console.log(error.message);
          }
      });

      this.setImage();
      

    },
    methods:{
      callTheApi: async function callTheApi() {
        const { res, error } = await getInfo(this.config);

        if (res) {
          this.message = res.data.stationName
        }else{
          this.message = error.message
        }
      },
      async setImage() {
        const blob = await axios.get('http://localhost:8081/api/user/image?ownerId=624344e863329a0dffb0fcfa', addAuthorizationRequestConfigWithBlob());
        const theImage = window.URL.createObjectURL(blob.data);
        var elemImage = document.getElementById("image");
        this.source = theImage;
      },
      convertUvVal(uvVal) {
        if(uvVal < 0.015){
            return 0;
        }else{
            if(uvVal < 0.035) 
                return 1;
            else{
                if(uvVal < 0.06) 
                    return 2;
                else{
                    if(uvVal < 0.075) 
                        return 3;
                    else{
                        if(uvVal < 0.1)
                            return 4;
                        else{
                            if(uvVal < 0.125) 
                                return 5;
                            else{
                                if(uvVal < 0.150)
                                    return 6;
                                else{
                                    if(uvVal < 0.175) 
                                        return 7;
                                    else{
                                        if(uvVal < 0.2)
                                            return 8;
                                        else{
                                            if(uvVal < 0.225)
                                                return 9;
                                            else{
                                                if(uvVal < 0.25)
                                                    return 10;
                                                else{
                                                    if(uvVal < 0.275)
                                                        return 11;
                                                    else{
                                                        return 12;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  }
}
</script>

<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">

  <div class="sensor-card" style="min-width: 200px;">
    <div class="container" style="margin-bottom: 20px;">
      <div class="row">
        <div class="col">
          <h3 class="float-start">{{title}}</h3>
        </div>
        <div class="col">
          <i :class="color" class="float-end"/>
        </div>
      </div>
    </div>

    <p class="text-center"> {{ dict[idLang]["crowdLevel"] }}: {{ crowdLevel }}% </p>

    <div class="container">
      <div class="row">

        <div class="col">
        <p class="text-black font-weight-bold" style="margin-bottom: 20px;"> {{ dict[idLang]["env"] }} </p>
        <div class="container">
            <span style="font-size:22px; margin-right:12px;">
              <img :src="termIcons" alt="" />
            </span>
            <span class="align-middle">
            <p class="text-black font-weight-bold" style="display:inline; font-size:25px;"> {{temp}} </p>
            </span>
            <span class="align-bottom">
            °C
            </span>
        </div>
        <div class="container">
            <span style="font-size:22px; margin-right:12px;">
              <img :src="dropletIcon" alt="" />
            </span>
            <span class="align-middle">
            <p class="text-black" style="display:inline; font-size:25px;"> {{hum}} </p>
            </span>
            <span class="align-bottom">
            %
            </span>
        </div>
        <div class="container" style="margin-bottom:10px;">
            <span style="font-size:22px; margin-right:12px;">
              <img :src="cloud_rainIcon" alt="" />
            </span>
            <span class="align-middle">
            <p class="text-black" style="display:inline; font-size:25px;"> {{rain}}</p>
            </span>
            <span class="align-bottom">
            mm
            </span>
        </div>

        <div class="container" style="margin-bottom:10px;">
            <span style="font-size:22px; margin-right:12px;">
              <img :src="sunIcon" alt="" />
            </span>
            <span class="align-middle">
            <p class="text-black" style="display:inline; font-size:25px;"> {{uvi}} </p>
            </span>
            <span class="align-bottom">
               {{ dict[idLang]["uv"] }}
            </span>
        </div>
      </div>

      <div class="col">
        <p class="text-black font-weight-bold" style="margin-bottom: 20px;"> {{ dict[idLang]["wind"] }} </p>
        <div class="container">
            <span style="font-size:22px; margin-right:12px;">
              <img :src="speedometerIcon" alt="" />
            </span>
            <span class="align-middle">
            <p class="text-black font-weight-bold" style="display:inline; font-size:25px;"> {{wind_speed}} </p>
            </span>
            <span class="align-bottom">
               {{ dict[idLang]["speed"] }}
            </span>
        </div>
        <div class="container">
            <span style="font-size:22px; margin-right:12px;">
              <img :src="compassIcon" alt="" />
            </span>
            <span class="align-middle">
            <p class="text-black" style="display:inline; font-size:25px;"> {{wind_dir}} </p>
            </span>
            <span class="align-bottom">
            
            </span>
        </div>
        <div class="container" style="margin-bottom:10px;">
            <span style="font-size:22px; margin-right:12px;">
              <img :src="windIcon" alt="" />
            </span>
            <span class="align-middle">
            <p class="text-black" style="display:inline; font-size:25px;"> {{wind_gust}} </p>
            </span>
            <span class="align-bottom">
               {{ dict[idLang]["speed"] }}
            </span>
        </div>
      </div>

      </div>
    </div>  

        <div class="container text-center" style="margin-top: 20px;">
          <span style="margin-right: 10px;">
            <img id="image" :src="source" width="30"/>
          </span>
          <span>
            {{ dict[idLang]["city"] }} {{ city }}
          </span>
        </div>

    </div>

</template>

<style>
  :host {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  header {
    line-height: 1.5;
  }

  .logo {
    display: block;
    margin: 0 auto 2rem;
  }

  a,
  .green {
    text-decoration: none;
    color: hsla(160, 100%, 37%, 1);
    transition: 0.4s;
  }

  @media (hover: hover) {
    a:hover {
      background-color: hsla(160, 100%, 37%, 0.2);
    }
  }

  @media (min-width: 1024px) {
    body {
      display: flex;
      place-items: center;
    }

    #app {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 0 2rem;
    }

    header {
      display: flex;
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }

    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }

    .logo {
      margin: 0 2rem 0 0;
    }
  }

  h1 {
    font-weight: 500;
    font-size: 2.6rem;
    top: -10px;
  }

  h3 {
    font-size: 1.2rem;
  }

  .greetings h1,
  .greetings h3 {
    text-align: center;
  }

  @media (min-width: 1024px) {
    .greetings h1,
    .greetings h3 {
      text-align: left;
    }
  }

  .item {
    margin-top: 2rem;
    display: flex;
  }

  .details {
    flex: 1;
    margin-left: 1rem;
  }

  i {
    display: flex;
    place-items: center;
    place-content: center;
    width: 32px;
    height: 32px;

    color: var(--color-text);
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
    color: var(--color-heading);
  }

  @media (min-width: 1024px) {
    .item {
      margin-top: 0;
      padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
    }

    i {
      top: calc(50% - 25px);
      left: -26px;
      position: absolute;
      border: 1px solid var(--color-border);
      background: var(--color-background);
      border-radius: 8px;
      width: 50px;
      height: 50px;
    }

    .item:before {
      content: ' ';
      border-left: 1px solid var(--color-border);
      position: absolute;
      left: 0;
      bottom: calc(50% + 25px);
      height: calc(50% - 25px);
    }

    .item:after {
      content: ' ';
      border-left: 1px solid var(--color-border);
      position: absolute;
      left: 0;
      top: calc(50% + 25px);
      height: calc(50% - 25px);
    }

    .item:first-of-type:before {
      display: none;
    }

    .item:last-of-type:after {
      display: none;
    }
  }

  .sensor-card {
  background-color: aliceblue;
  border-radius: 10px;
  padding: 15px;

  }

.svg.bi.bi-icon-sm {
    height: 8px !important;
    width: 8px !important;
}

.red-sem {
    background: url('stoplights-fill.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    height: 26px;
    width: 26px;
    filter: invert(11%) sepia(100%) saturate(6260%) hue-rotate(10deg) brightness(103%) contrast(117%);
    
}

.yellow-sem {
    background: url('stoplights-fill.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    height: 26px;
    width: 26px;
    filter: invert(77%) sepia(92%) saturate(511%) hue-rotate(359deg) brightness(104%) contrast(105%);
    
}

.green-sem {
    background-color: green;
    background: url('stoplights-fill.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    height: 26px;
    width: 26px;
    filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%);
}

</style>
