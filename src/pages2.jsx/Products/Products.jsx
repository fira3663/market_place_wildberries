import { AddCircle, Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  Input,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useAddProductsMutation,
  useDelProductsMutation,
  useEditProductsMutation,
  useGetProductsQuery,
} from "../../api/products";
import { useGetCategoriesQuery } from "../../api/categories";
import { useGetSubCategoriesQuery } from "../../api/subCategory";
import { multiFiles } from "../../api/files";

import Title from "../../Layout2/components/Title";
import MuiCard from "../Categories/components/MuiCard";
import MuiModal from "../Categories/components/MuiModal";
import ModalFull from "../../Layout2/components/ModalFull";
import * as yup from "yup";
import { useFormik } from "formik";
import { singleFile } from "../../api/files";
import { useGetBrandsQuery } from "../../api/brands";
import FormBuilder from "../../Layout2/components/FormBuilder";

const Products = () => {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: subCategories = [] } = useGetSubCategoriesQuery();
  const { data: brands = [] } = useGetBrandsQuery();
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const { data = [] } = useGetProductsQuery();
  const [add] = useAddProductsMutation();
  const [edit] = useEditProductsMutation();
  const [del] = useDelProductsMutation();
  const [img, setImg] = useState("");
  const [value, setValue] = useState("");
  const [properties, setProperties] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      categoryId: "",
      subCategoryId: "",
      brandId: "",
      price: "",
      discount: "",
      hasDiscount: false,
      isNew: false,
    },
    validationSchema: yup.object({
      name: yup
        .string("Enter category name")
        .min(3, "Name should be of minimum 3 characters length")
        .required("Name is required"),
    }),
    onSubmit: async (values) => {
      let product = { ...values };
      if (img.length === 0) return alert("Please select img");
      product.description = value;
      product.properties = properties;
      let formData = new FormData();

      for (let f of img) {
        formData.append("files", f);
      }
      const data = await multiFiles(formData);
      let arr = [];
      for (let img of data.img) {
        let obj = {
          type: img.mimetype,
          src: img.path,
        };
        arr.push(obj);
      }

      product.media = arr;
      add(product);
      setAddModal(false);
    },
  });

  const formik_update = useFormik({
    initialValues: {
      id: null,
      name: "",
      categoryId: "",
      subCategoryId: "",
      brandId: "",
      price: "",
      discount: "",
      hasDiscount: false,
      isNew: false,
    },
    validationSchema: yup.object({
      name: yup
        .string("Enter category name")
        .min(3, "Name should be of minimum 3 characters length")
        .required("Name is required"),
    }),
    onSubmit: async (values) => {
      let product = { ...values };

      product.description = value;
      product.properties = properties;
      if (img) {
        let formData = new FormData();

        for (let f of img) {
          formData.append("files", f);
        }
        const data = await multiFiles(formData);
        let arr = [];
        for (let img of data.img) {
          let obj = {
            type: img.mimetype,
            src: img.path,
          };
          arr.push(obj);
        }

        product.media = arr;
      }
      edit(product);
      setEditModal(false);
    },
  });

  return (
    <div>
      <Title>Products</Title>
      <Grid container spacing={2} direction="row">
        {data.length > 0 &&
          data.map((category) => {
            return (
              <Grid key={category.id} item xs={12} sm={6} md={4} lg={3}>
                  <div>
                  <h1>Цена: {category.price} Руб</h1>
                  <h1>скидка {category.discount} %</h1>
                  <h1>Цена со скидкой: {  category.price - category.price * category.discount / "100" } Руб</h1>
               
                  
                  </div>
                <MuiCard name={category.name} img={category.media[0].src}>
                
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      console.log(category)
                      formik_update.setFieldValue("id", category.id);
                      formik_update.setFieldValue("name", category.name);
                      formik_update.setFieldValue(
                        "categoryId",
                        category.categoryId
                      );
                      formik_update.setFieldValue(
                        "subCategoryId",
                        category.subCategoryId
                      );
                      formik_update.setFieldValue("brandId", category.brandId);
                      formik_update.setFieldValue("price", category.price);
                      formik_update.setFieldValue("discount", category.discount);
                      setValue(category.description);
                      setProperties(category.properties);
                      setEditModal(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      del(category.id);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </MuiCard>
              </Grid>
            );
          })}
        <Grid item alignSelf="flex-end">
          <IconButton color="primary" onClick={() => setAddModal(true)}>
            <AddCircle fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
      <ModalFull
        open={addModal}
        handleClose={() => setAddModal(false)}
        title="Add Product"
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container sx={{ p: 10 }} spacing={2}>
            <Grid item>
              <TextField
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item>
              <TextField
                sx={{ mb: 2, minWidth: 212 }}
                className="px-2 my-2"
                variant="outlined"
                name="categoryId"
                id="category"
                select
                label="Category"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                error={
                  formik.touched.categoryId && Boolean(formik.errors.categoryId)
                }
                helperText={
                  formik.touched.categoryId && formik.errors.categoryId
                }
              >
                <MenuItem key={""} value={""}>
                  Choose category
                </MenuItem>
                {categories.length > 0 &&
                  categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                sx={{ mb: 2, minWidth: 212 }}
                className="px-2 my-2"
                variant="outlined"
                name="subCategoryId"
                id="subCategoryId"
                select
                label="Sub Category"
                value={formik.values.subCategoryId}
                onChange={formik.handleChange}
                error={
                  formik.touched.subCategoryId &&
                  Boolean(formik.errors.subCategoryId)
                }
                helperText={
                  formik.touched.subCategoryId && formik.errors.subCategoryId
                }
              >
                <MenuItem key={""} value={""}>
                  Choose sub category
                </MenuItem>
                {subCategories.length > 0 &&
                  subCategories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                sx={{ mb: 2, minWidth: 212 }}
                className="px-2 my-2"
                variant="outlined"
                name="brandId"
                id="brandId"
                select
                label="Brand"
                value={formik.values.brandId}
                onChange={formik.handleChange}
                error={formik.touched.brandId && Boolean(formik.errors.brandId)}
                helperText={formik.touched.brandId && formik.errors.brandId}
              >
                <MenuItem key={""} value={""}>
                  Choose brand
                </MenuItem>
                {brands.length > 0 &&
                  brands.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                sx={{ mb: 2, minWidth: 212 }}
                className="px-2 my-2"
                variant="outlined"
                name="price"
                id="price"
                type={"text"}
                label="Price"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              >
                <MenuItem key={""} value={Input}>
                  Choose brand
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                sx={{ mb: 2, minWidth: 212 }}
                className="px-2 my-2"
                variant="outlined"
                name="discount"
                id="discount"
                 type={"number"}
                label="Discount%"
                value={formik.values.discount}
                onChange={formik.handleChange}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
              >
                <MenuItem key={""} value={""}>
                  Choose brand
                </MenuItem>
              
              </TextField>
            </Grid>
           
            <Grid xs={12} sx={{ p: 2 }}>
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: "flex", gap: 5 }}>
                {properties.map((elem) => {
                  return (
                    <div
                      key={elem.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      <div style={{ display: "flex", gap: 5 }}>
                        <TextField
                          value={elem.name}
                          onChange={(e) => {
                            const copy = [
                              ...properties.map((item) => {
                                if (item.id === elem.id) {
                                  item.name = e.target.value;
                                }
                                return item;
                              }),
                            ];
                            setProperties(copy);
                          }}
                        />
                        <IconButton
                          color="error"
                          onClick={() => {
                            const copy = [
                              ...properties.filter(
                                (item) => item.id !== elem.id
                              ),
                            ];
                            setProperties(copy);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </div>
                      <FormBuilder
                        key={elem.id}
                        fieldChange={(values) => {
                          const copy = [
                            ...properties.map((item) => {
                              if (item.id === elem.id) {
                                item.properties = [...values];
                              }
                              return item;
                            }),
                          ];
                          setProperties(copy);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={() => {
                  let obj = {
                    id: new Date().getTime(),
                    name: "",
                    properties: [],
                  };
                  const copy = [...properties, obj];
                  setProperties(copy);
                }}
              >
                Add field
              </Button>
            </Grid>
            <Grid item>
              <input
                type="file"
                name="img"
                multiple
                onChange={(event) => {
                  setImg(event.target.files);
                }}
              />
            </Grid>
            <Grid xs={12} item sx={{ textAlign: "right" }}>
              <Button
                color="primary"
                variant="contained"
                sx={{ mt: 3, mr: 3 }}
                type="submit"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </ModalFull>
      <ModalFull
        open={editModal}
        handleClose={() => setEditModal(false)}
        title="Edit Product"
      >
        <form onSubmit={formik_update.handleSubmit}>
          <Grid container sx={{ p: 10 }} spacing={2}>
            <Grid item>
              <TextField
                id="name"
                name="name"
                label="Name"
                value={formik_update.values.name}
                onChange={formik_update.handleChange}
                error={
                  formik_update.touched.name &&
                  Boolean(formik_update.errors.name)
                }
                helperText={
                  formik_update.touched.name && formik_update.errors.name
                }
              />
            </Grid>
            <Grid item>
              <TextField
                sx={{ mb: 2, minWidth: 212 }}
                className="px-2 my-2"
                variant="outlined"
                name="categoryId"
                id="category"
                select
                label="Category"
                value={formik_update.values.categoryId}
                onChange={formik_update.handleChange}
                error={
                  formik_update.touched.categoryId &&
                  Boolean(formik_update.errors.categoryId)
                }
                helperText={
                  formik_update.touched.categoryId &&
                  formik_update.errors.categoryId
                }
              >
                <MenuItem key={""} value={""}>
                  Choose category
                </MenuItem>
                {categories.length > 0 &&
                  categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                sx={{ mb: 2, minWidth: 212 }}
                className="px-2 my-2"
                variant="outlined"
                name="subCategoryId"
                id="subCategoryId"
                select
                label="Sub Category"
                value={formik_update.values.subCategoryId}
                onChange={formik_update.handleChange}
                error={
                  formik_update.touched.subCategoryId &&
                  Boolean(formik_update.errors.subCategoryId)
                }
                helperText={
                  formik_update.touched.subCategoryId &&
                  formik_update.errors.subCategoryId
                }
              >
                <MenuItem key={""} value={""}>
                  Choose sub category
                </MenuItem>
                {subCategories.length > 0 &&
                  subCategories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                sx={{ mb: 2, minWidth: 212 }}
                className="px-2 my-2"
                variant="outlined"
                name="brandId"
                id="brandId"
                select
                label="Sub Category"
                value={formik_update.values.brandId}
                onChange={formik_update.handleChange}
                error={
                  formik_update.touched.brandId &&
                  Boolean(formik_update.errors.brandId)
                }
                helperText={
                  formik_update.touched.brandId && formik_update.errors.brandId
                }
              >
                <MenuItem key={""} value={""}>
                  Choose brand
                </MenuItem>
                {brands.length > 0 &&
                  brands.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                sx={{ mb: 2, minWidth: 212 }}
                className="px-2 my-2"
                variant="outlined"
                name="price"
                id="price"
                type={"text"}
                label="Price"
                value={formik_update.values.price}
                onChange={formik_update.handleChange}
                error={formik_update.touched.price && Boolean(formik.errors.price)}
                helperText={formik_update.touched.price && formik.errors.price}
              >
                <MenuItem key={""} value={""}>
                  Choose brand
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                sx={{ mb: 2, minWidth: 212 }}
                className="px-2 my-2"
                variant="outlined"
                name="discount"
                id="discount"
                 type={"number"}
                label="Discount%"
                value={formik_update.values.discount}
                onChange={formik_update.handleChange}
                error={formik_update.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik_update.touched.discount && formik.errors.discount}
              >
                <MenuItem key={""} value={""}>
                  Choose brand
                </MenuItem>
              
              </TextField>
            </Grid>
            <Grid xs={12} sx={{ p: 2 }}>
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: "flex", gap: 5 }}>
                {properties.map((elem) => {
                  return (
                    <div
                      key={elem.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      <div style={{ display: "flex", gap: 5 }}>
                        <TextField
                          value={elem.name}
                          onChange={(e) => {
                            const copy = [
                              ...properties.map((item) => {
                                if (item.id === elem.id) {
                                  item.name = e.target.value;
                                }
                                return item;
                              }),
                            ];
                            setProperties(copy);
                          }}
                        />
                        <IconButton
                          color="error"
                          onClick={() => {
                            const copy = [
                              ...properties.filter(
                                (item) => item.id !== elem.id
                              ),
                            ];
                            setProperties(copy);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </div>
                      <FormBuilder
                        key={elem.id}
                        properties={elem.properties}
                        fieldChange={(values) => {
                          const copy = [
                            ...properties.map((item) => {
                              if (item.id === elem.id) {
                                item.properties = [...values];
                              }
                              return item;
                            }),
                          ];
                          setProperties(copy);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={() => {
                  let obj = {
                    id: new Date().getTime(),
                    name: "",
                    properties: [],
                  };
                  const copy = [...properties, obj];
                  setProperties(copy);
                }}
              >
                Add field
              </Button>
            </Grid>
            <Grid item>
              <input
                type="file"
                name="img"
                multiple
                onChange={(event) => {
                  setImg(event.target.files);
                }}
              />
            </Grid>
            <Grid xs={12} item sx={{ textAlign: "right" }}>
              <Button
                color="primary"
                variant="contained"
                sx={{ mt: 3, mr: 3 }}
                type="submit"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </ModalFull>
    </div>
  );
};

export default Products;
