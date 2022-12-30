import { CKEditor } from '@ckeditor/ckeditor5-react';
// import { ClassicEditor } from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Box, Card, Button, CircularProgress, Container, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, CardMedia } from '@mui/material'
import axios from 'axios';

import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CustomTab from '../../components/tab';
import { callUpload, call } from '../../utils/api'



const AddArticlesPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [articles, setArticles] = useState({
        id: '',
        mainImageURL: '',
        status: '',
        isActive: '',
        articleTranslations: [
            {
                name: '',
                short: '',
                description: '',
                languageId: 1,
            },
            {
                name: '',
                short: '',
                description: '',
                languageId: 2,
            },
        ],
    });



    console.log(articles)

    const inputChangeName = (e, index, editor) => {
        articles.articleTranslations[index].name = e.target.value;
        setArticles({ ...articles });
    };

    const inputChangeShort = (e, index, editor) => {
        articles.articleTranslations[index].short = e.target.value;
        setArticles({ ...articles });
    };
    const pushComponent = (name, short, description, index, inputChangeName, inputChangeShort) => (
        <Stack direction="column" spacing={2} padding={2}>
            <TextField
                label="Name"
                name="name"
                defaultValue={name}
                onChange={(e) => inputChangeName(e, index)}
                variant="outlined"
            />
            <TextField
                label="Short"
                name="short"
                defaultValue={short}
                onChange={(e) => inputChangeShort(e, index)}
                variant="outlined"
            />
            <Box>
                <Typography variant="h6" marginBottom={1}>
                    Description :
                </Typography>
                <CKEditor
                    editor={ClassicEditor}
                    data={description}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        articles.articleTranslations[index].description = data;
                        setArticles({ ...articles });
                        console.log(articles);
                    }}
                    onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                            writer.setStyle('height', '200px', editor.editing.view.document.getRoot());
                        });
                    }}
                    name="description"
                />
            </Box>
        </Stack>
    );

    const header = ["VN", "EN"]

    const [selectedImage, setSelectedImage] = useState(null);
    // const handleUpdateImage = async (e) => {
    //     e.preventDefault();
    //     const formData = new FormData()
    //     formData.append('file', selectedImage);
    //     try {
    //         callUpload(`articles/upload/`, "post", formData).then((res) => {
    //             // const response = res
    //             if (res.success === true || selectedImage === null) {

    //                 const updateData = {
    //                     id: articles.id,
    //                     mainImageURL: res.url || articles.articles.mainImageURL,
    //                     status: articles.status,
    //                     isActive: articles.isActive,
    //                     articleTranslations: [
    //                         {
    //                             name: articles.articleTranslations[0].name,
    //                             short: articles.articleTranslations[0].short,
    //                             description: articles.articleTranslations[0].description,
    //                             languageId: 1,
    //                         },
    //                         {
    //                             name: articles.articleTranslations[1].name,
    //                             short: articles.articleTranslations[1].short,
    //                             description: articles.articleTranslations[1].description,
    //                             languageId: 2,
    //                         },
    //                     ],
    //                 };
    //                 axios({
    //                     method: 'put',
    //                     url: `https://web-api.zadez.vn/articles/${articles.code}`,
    //                     data: updateData
    //                 })
    //             }
    //             else { setSelectedImage('') }
    //         })

    //     }
    //     catch (error) { console.log(error) }
    // }
    const updateProductHandler = async () => {
        // toast.success('Wow so easy !');
        const formData = new FormData();
        formData.append('file', selectedImage);
        try {
            const response = callUpload('articles/upload/', 'POST', formData).then((res) => {
                console.log(res);
                const updateData = {
                    id: articles.id,
                    mainImageURL: res.url || articles.mainImageURL,
                    status: articles.status,
                    isActive: articles.isActive,
                    articleTranslations: [
                        {
                            name: articles.articleTranslations[0].name,
                            short: articles.articleTranslations[0].short,
                            description: articles.articleTranslations[0].description,
                            languageId: 1,
                        },
                        {
                            name: articles.articleTranslations[1].name,
                            short: articles.articleTranslations[1].short,
                            description: articles.articleTranslations[1].description,
                            languageId: 2,
                        },
                    ],
                };
                call(`articles/`, 'POST', updateData);
                // axios
                //   .put(`https://web-api.zadez.vn/articles/update/${id}`, updateData)
                //   .then((item) => {
                //     console.log(item);
                //   })
                //   .catch((err) => console.log(err));
                setArticles({ ...articles, serialImageURL: res.url });
            });
            toast.success('Add Successfully', { autoClose: 2000 });
            setTimeout(() => {
                navigate('/dashboard/articles');
            }, 2000);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };


    return (
        <Container>
            {!loading ? (
                <>
                    <Typography variant="h1" component="h2">
                        Add Articles
                    </Typography>

                    <Box sx={{ width: '100%' }}>
                        <Container>
                            <Card sx={{ p: 3, display: 'flex', gap: 3, marginY: 3 }}>
                                <Stack direction="column" spacing={2}>
                                    <Stack direction="row" spacing={2} sx={{ width: "200px" }} >
                                        <TextField
                                            id="outlined-basic"
                                            name="id"
                                            label="id"
                                            variant="outlined"
                                            onChange={(e) => setArticles((prevState) => ({
                                                ...prevState,
                                                id: e.target.value,
                                            }))}
                                        />
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                        <Box width="200px">
                                            <InputLabel id="select-active" style={{ fontSize: '12px' }}>
                                                Status
                                            </InputLabel>
                                            <Select
                                                labelId="select-active"
                                                // name="active"
                                                // onChange={changeActive}
                                                variant="outlined"
                                                label="Active"
                                                fullWidth
                                                // value={active}
                                                onChange={(e) => setArticles((prevState) => ({
                                                    ...prevState,
                                                    status: e.target.value,
                                                }))}
                                            >
                                                <MenuItem value={'Close'}> Close</MenuItem>
                                                <MenuItem value={'Open'}>Open</MenuItem>
                                                <MenuItem value={'Pending'}>Pending</MenuItem>
                                            </Select>
                                        </Box>
                                    </Stack>

                                    <Stack direction="row" spacing={2}>
                                        <Box width="200px">
                                            <InputLabel id="select-active" style={{ fontSize: '12px' }}>
                                                Active
                                            </InputLabel>
                                            <Select
                                                labelId="select-active"
                                                // name="active"
                                                onChange={(e) => setArticles((prevState) => ({
                                                    ...prevState,
                                                    isActive: e.target.value,
                                                }))}
                                                variant="outlined"
                                                label="Active"
                                                fullWidth
                                            >
                                                <MenuItem value>Yes</MenuItem>
                                                <MenuItem value={false}>No</MenuItem>
                                            </Select>
                                        </Box>
                                    </Stack>
                                </Stack>
                                <Stack direction="column" spacing={2}>
                                    <Box>
                                        {selectedImage && <CardMedia
                                            component="img"
                                            sx={{ width: 200 }}
                                            height="200"
                                            // image={`${cfg.cdnUrl}${product?.mainImageURL}`}
                                            src={URL?.createObjectURL(selectedImage)}
                                            alt=""
                                            centered
                                        />}
                                        <Input
                                            type="file"
                                            name="myImage"
                                            onChange={(event) => {
                                                setSelectedImage(event.target.files[0]);
                                            }}
                                        />
                                    </Box>
                                </Stack>
                            </Card>

                            <Card sx={{ p: 3, display: 'flex', gap: 3 }}>
                                <CustomTab
                                    header={
                                        header &&
                                        header.map((item, index) => [{ language: item, idx: index }])
                                    }
                                    bodies={
                                        articles.articleTranslations &&
                                        articles.articleTranslations.map((item, index) =>
                                            pushComponent(item.name, item.short, item.description, index, inputChangeName, inputChangeShort)
                                        )
                                    }
                                />
                            </Card>

                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                                <Button variant="contained" color="error"
                                    onClick={updateProductHandler}
                                >
                                    Update
                                </Button>
                            </Box>
                        </Container>
                    </Box>
                </>
            ) : (
                <CircularProgress />
            )}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Container>
    )
}

export default AddArticlesPage