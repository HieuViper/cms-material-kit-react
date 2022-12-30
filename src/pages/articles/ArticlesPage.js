
import axios from 'axios';
import { styled } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
    Box,
    Button,
    Card,
    Checkbox,
    CircularProgress,
    Container,
    IconButton,
    MenuItem,
    Modal,
    Popover,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
// components
import { ProductSort, ProductFilterSidebar } from '../../sections/@dashboard/articles';
// mock
import PRODUCTS from '../../_mock/products';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import Label from '../../components/label/Label';
import { ColorPreview } from '../../components/color-utils';
import config from '../../utils/config';
import Iconify from '../../components/iconify';
// ----------------------------------------------------------------------
import { authContext } from '../../utils/Auth';
import { call } from '../../utils/api'

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});
export default function ArticlesPage() {
    const navigate = useNavigate();
    const [openFilter, setOpenFilter] = useState(false);
    const [articles, setArticles] = useState();
    const [openMenu, setOpenMenu] = useState();
    const [currentSelectProduct, setCurrentSelectProduct] = useState();
    const [loading, setLoading] = useState(false);
    console.log('🚀 ~ file: ProductPageTest.js:51 ~ ProductsPageTest ~ loading', loading);


    const userData = useContext(authContext);
    console.log(userData.roles.includes('admin'))
    const handleOpenFilter = () => {
        setOpenFilter(true);
    };

    const handleCloseFilter = () => {
        setOpenFilter(false);
    };

    const handleOpenMenu = (event) => {
        setCurrentSelectProduct(JSON.parse(event.currentTarget.dataset.currentproduct));
        setOpenMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpenMenu(null);
    };

    const handleOpenEdit = () => {
        if (userData.roles.includes('admin') && userData.roles.includes('system')) {
            navigate(`/dashboard/edit-articles/${currentSelectProduct.id}`, { state: currentSelectProduct });
        }
    };
    const handleAddArticle = () => {
        navigate(`/dashboard/add-articles`)
    }
    const handleDeleteArticle = () => {
        // call(`articles/4}`, "delete", null).then((res) => { console.log(res) })
        if (userData.roles.includes('system')) {
            axios
                .delete(`https://web-api.zadez.vn/articles/${currentSelectProduct.id}`)
                .then((res) => {

                    setOpenMenu(null);
                })
                .catch((err) => console.log(err));
        }
    }


    useEffect(() => {
        setLoading(true);
        axios
            .get('https://web-api.zadez.vn/articles')
            .then((res) => {
                setArticles(res.data.data);
                setLoading(false);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <>
            <Helmet>
                <title> Dashboard: Articles | Minimal UI </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Articles table
                    <Button onClick={handleAddArticle} sx={{ ml: 5 }}>+Add new Articles</Button>
                </Typography>


                <Card>
                    <Stack
                        direction="row"
                        flexWrap="wrap-reverse"
                        alignItems="center"
                        justifyContent="flex-end"
                        sx={{ mb: 3, mt: 3 }}
                    >
                        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                            <ProductFilterSidebar
                                openFilter={openFilter}
                                onOpenFilter={handleOpenFilter}
                                onCloseFilter={handleCloseFilter}
                            />
                            <ProductSort />
                        </Stack>
                    </Stack>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Image</TableCell>
                                        <TableCell align="left">Name</TableCell>
                                        <TableCell align="left">Id</TableCell>
                                        <TableCell align="left">Active</TableCell>
                                        <TableCell align="left">Status</TableCell>
                                        <TableCell align="left" />
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {loading ? (
                                        <Box
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        articles &&
                                        articles.map((articles, index) => (
                                            <TableRow key={articles.id}>
                                                <TableCell align="left">
                                                    <Box sx={{ pt: '100%', position: 'relative' }}>
                                                        <StyledProductImg
                                                            alt={articles.ArticleTranslations[0].name}
                                                            src={config.apiUrl + articles.mainImageURL}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left">{articles.ArticleTranslations[0].name}</TableCell>
                                                {/* <TableCell align="left">
                                                    <Box sx={{ pt: '100%', position: 'relative' }}>
                                                        <StyledProductImg
                                                                alt={articles.serialImageURL}
                                                                src={config.apiUrl + articles.serialImageURL}
                                                        />
                                                    </Box>
                                                </TableCell> */}
                                                <TableCell align="left">{articles.id}</TableCell>
                                                <TableCell align="left">{articles.active ? 'True' : 'False'}</TableCell>
                                                <TableCell align="left">{articles.status}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="large"
                                                        color="inherit"
                                                        onClick={handleOpenMenu}
                                                        data-currentproduct={JSON.stringify(articles)}
                                                    >
                                                        <Iconify icon={'eva:more-vertical-fill'} />
                                                    </IconButton>
                                                </TableCell>

                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                </Card>

                <Popover
                    open={Boolean(openMenu)}
                    anchorEl={openMenu}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                        sx: {
                            p: 1,
                            width: 140,
                            '& .MuiMenuItem-root': {
                                px: 1,
                                typography: 'body2',
                                borderRadius: 0.75,
                            },
                        },
                    }}
                >
                    <MenuItem sx={{ color: 'info.main' }} onClick={handleOpenEdit}>
                        <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                        Edit
                    </MenuItem>

                    <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteArticle}>
                        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                        Delete
                    </MenuItem>
                </Popover>
            </Container>
        </>
    );
}


// ArticlesPage