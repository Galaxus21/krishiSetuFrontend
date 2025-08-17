import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage, type Languages } from "../store/languageSlice";
import type { StoreSelector } from "../store/store";

export function useLanguage() {
  const language = useSelector((store: StoreSelector) => store.language);
  const { i18n } = useTranslation();
  const dispatch = useDispatch();


  function changeLanguage(lang: Languages){
    i18n.changeLanguage(lang)
    dispatch(setLanguage(lang));
  }

  return {
    language,
    changeLanguage
  }
  
}