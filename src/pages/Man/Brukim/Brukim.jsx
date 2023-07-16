import React from "react";
import List from "@mui/material/List/List";

import Card from "../../../components/Card";
import { Link } from "react-router-dom";

import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import MenuIcon from "@mui/icons-material/Menu";
import { useGetProductsQuery } from "../../../api/products";
import { useDispatch, useSelector } from "react-redux";
import { Forgit } from "../../../reducers/basket";

const Brukim = () => {
  const { data = [] } = useGetProductsQuery();
  const dispatch = useDispatch();

  return (
    <div>
      <div className="w-[90%] m-auto pt-10 pb-10">
        <div className=" flex justify-evenly pb-10">
          <div className="flex items-center">
            <MenuIcon className="bg-white" />
            <select className="font-bold h-6" name="" id="">
              <option className="font-bold" value="">
                Женщинам
              </option>
              <option value="">Блузки и рубашки</option>
              <option value="">Брюки</option>
              <option value="">Верхняя одежда</option>
              <option value="">Джемперы, водолазки и кардиганы</option>
              <option value="">Джинсы</option>
              <option value="">Комбинезоны</option>
              <option value="">Костюмы</option>
              <option value="">Лонгсливы</option>
              <option value="">Платья и сарафаны</option>
              <option value="">Пиджаки, жилеты и жакеты</option>
              <option value="">Толстовки, свитшоты и худи</option>
              <option value=""> Туники Футболки и топы</option>
            </select>
          </div>
          <div className="flex items-center">
            <CompareArrowsIcon className="bg-white" />
            <select className="font-bold h-6" name="" id="">
              <option className="font-bold" value="">
                По популярности
              </option>
              <option className="font-bold" value="">
                По рейтингу
              </option>
              <option className="font-bold" value="">
                По возрастанию цены
              </option>
              <option className="font-bold" value="">
                По убыванию цены
              </option>
              <option className="font-bold" value="">
                По новинкам
              </option>
              <option className="font-bold" value="">
                Сначала выгодные
              </option>
            </select>
          </div>
          <div className="flex items-center">
            <select className="font-bold h-6" name="" id="">
              <option value="" hidden>
                Категория
              </option>
              <option className="font-bold" value="">
                Бриджи
              </option>
              <option className="font-bold" value="">
                Брюки
              </option>
              <option className="font-bold" value="">
                Капри
              </option>
              <option className="font-bold" value="">
                Кюлоты
              </option>
              <option className="font-bold" value="">
                Леггинсы
              </option>
              <option className="font-bold" value="">
                Тайтсы
              </option>
            </select>
          </div>
          <div className="flex items-center">
            <select className="font-bold h-6" name="" id="">
              <option className="font-bold" value="" hidden>
                Срок доставки
              </option>
              <option className="font-bold" value="">
                1 день
              </option>
              <option className="font-bold" value="">
                2 дня
              </option>
              <option className="font-bold" value="">
                до 3 дней
              </option>
              <option className="font-bold" value="">
                до 5 дней
              </option>
            </select>
          </div>
          <div className="flex items-center">
            <select className="font-bold h-6" name="" id="">
              <option className="font-bold" value="" hidden>
                Бренд
              </option>
              <option className="font-bold" value="">
                adidas
              </option>
              <option className="font-bold" value="">
                Nike
              </option>
              <option className="font-bold" value="">
                Puma
              </option>
            </select>
          </div>
          <div className="flex items-center">
            <select className="font-bold h-6" name="" id="">
              <option value="" hidden>
                Продавец
              </option>
              <option className="font-bold" value="">
                wildberries
              </option>
              <option className="font-bold" value="">
                MELON
              </option>
              <option className="font-bold" value="">
                ТВОЁ
              </option>
            </select>
          </div>
          <div className="flex items-center">
            <select className="font-bold h-6" name="" id="">
              <option className="font-bold" value="" hidden>
                цена
              </option>
            </select>
          </div>
          <div className="flex items-center">
            <select className="font-bold h-6" name="" id="">
              <option className="font-bold" value="" hidden>
                цвет
              </option>
              <option value="">красный</option>
              <option value="">желтый</option>
              <option value="">белый</option>
              <option value="">синий</option>

              <option value="">голубой</option>
              <option value="">оранжевый</option>
              <option value="">белый</option>
            </select>
          </div>
          <div className="flex items-center">
            <select className="font-bold h-6" name="" id="">
              <option className="font-bold" value="" hidden>
                Все фильтры
              </option>
            </select>
          </div>
        </div>
        <Link to={"/BrukimModal"}>
          <div className="flex justify-between">
            {data.map((el) => {
              if (el.categoryId == 2)
                return (
                  <div onClick={() => dispatch(Forgit(el.id))}>
               
                    <Card key={el.id} {...el} />
                  </div>
                );
            })}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Brukim;
