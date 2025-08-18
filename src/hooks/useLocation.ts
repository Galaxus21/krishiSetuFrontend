import { useEffect } from "react";
import { setLocation } from "../store/locationSlice";
import { useDispatch, useSelector } from "react-redux";
import type { StoreSelector } from "../store/store";

export function useLocation(){

  const dispatch = useDispatch();
  const location = useSelector((store: StoreSelector) => store.location);

  function getLocation(){
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }))
          console.log(`Latitude: ${position.coords.latitude},Longitude ${position.coords.longitude}`);
        },
        (err) => {
            console.warn(`Err Occured: ${err.message}`);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 } // Optional options
      );
    } else {
      console.warn("Geolocation is not supported by your browser.");
    }
  }

  useEffect(getLocation, []);

  return {location}

}