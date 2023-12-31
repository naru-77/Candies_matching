import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import TextInputRow from '../components/TextInputRow';
import { PostMangaData, defaultPostMangaData } from '../data/PostMangaData';
import DatePicker from '../components/DatePicker';
import NumerInputRow from '../components/NumberInputRow';
import NumberInputRow from '../components/NumberInputRow';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HeaderBar } from '../components/Header';

type ReceiveParams = {
  company_id: number;
};

const RegisterAndEditMangaPage: React.FC<{
  isEditMode: boolean;
  data: PostMangaData;
}> = ({ isEditMode, data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = location.state as ReceiveParams;

  const [mangaData, setMangaData] = React.useState(defaultPostMangaData);
  const [error, setError] = React.useState(false); // エラーの状態
  const [isSerial, setIsSerial] = React.useState(false);
  useEffect(() => {
    if (data) {
      setMangaData(data);
    } else {
      mangaData.is_serialization = isSerial;
    }
    mangaData.company_id = params.company_id;
  }, []);

  const postFormData = (mangaData: PostMangaData) => {
    const axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    axiosInstance.defaults.withCredentials = true;
    axiosInstance
      .post(
        'http://localhost:8000/mangaLists/register',
        JSON.stringify(mangaData),
      )
      .then((res) => {
        // 登録後は元の画面に戻る
        console.log('success');
        navigate('/login/publisher', {
          state: { company_id: params.company_id },
        });
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  };

  return (
    <>
      <HeaderBar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? '漫画の編集画面' : '漫画の登録画面'}
        </Typography>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <TextInputRow
              isHalf={false}
              required={true}
              name="mangaTitle"
              labelText="漫画のタイトル"
              placeholderText="漫画のタイトル"
              value={mangaData.title}
              isTextField={true}
              onValueChange={(value) => (mangaData.title = value)}
            />

            <TextInputRow
              isHalf={false}
              required={true}
              name="mangaAuthor"
              labelText="漫画の作者"
              placeholderText="漫画の作者"
              value={mangaData.author}
              isTextField={true}
              onValueChange={(value) => (mangaData.author = value)}
            />

            <TextInputRow
              isHalf={false}
              required={false}
              name="mangaSummary"
              labelText="漫画の概要"
              placeholderText="漫画の概要"
              value={mangaData.summary}
              isTextField={false}
              onValueChange={(value) => (mangaData.summary = value)}
            />

            <TextInputRow
              isHalf={false}
              required={true}
              name="mangaGenre"
              labelText="漫画のジャンル"
              placeholderText="漫画のジャンル"
              value={mangaData.genre}
              isTextField={true}
              onValueChange={(value) => (mangaData.genre = value)}
            />

            <TextInputRow
              isHalf={false}
              required={false}
              name="mangaEditor"
              labelText="漫画の編集者"
              placeholderText="漫画の編集者"
              value={mangaData.editor}
              isTextField={true}
              onValueChange={(value) => (mangaData.editor = value)}
            />

            <TextInputRow
              isHalf={false}
              required={false}
              name="mangaPictureUrl"
              labelText="漫画の画像"
              placeholderText="漫画の画像"
              value={mangaData.picture_url}
              isTextField={true}
              onValueChange={(value) => (mangaData.picture_url = value)}
            />

            <TextInputRow
              isHalf={false}
              required={false}
              name="mangaOthers"
              labelText="その他"
              placeholderText="その他"
              value={mangaData.others}
              isTextField={true}
              onValueChange={(value) => (mangaData.others = value)}
            />

            <Grid
              item
              xs={6}
              sm={6}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Checkbox
                checked={isSerial}
                onClick={(e) => {
                  setIsSerial(!isSerial);
                  mangaData.is_serialization = isSerial;
                }}
              />
              <Typography
                sx={{
                  marginLeft: '8px',
                  width: '200px',
                }}
              >
                完結済みか
              </Typography>
            </Grid>

            <NumberInputRow
              isHalf={true}
              required={false}
              name="mangaEdition"
              labelText="版数"
              placeholderText="版数"
              value={mangaData.edition}
              isTextField={true}
              onValueChange={(value) => (mangaData.edition = Number(value))}
            />

            <DatePicker
              value={mangaData.volumeone_at}
              onValueChange={(value) => {
                mangaData.volumeone_at = value;
              }}
            />

            <NumberInputRow
              isHalf={true}
              required={true}
              name="mangaEdition"
              labelText="総巻数"
              placeholderText="総巻数"
              value={mangaData.volumes}
              isTextField={true}
              onValueChange={(value) => (mangaData.volumes = value)}
            />
          </Grid>
        </Container>
        {error && (
          <Box sx={{ color: '#f44', textAlign: 'center' }}>
            登録に失敗しました
          </Box>
        )}
        <Container
          sx={{
            widows: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isEditMode ? (
            <Button
              onClick={() => {
                // 更新する処理
                console.log(mangaData);
                postFormData(mangaData);
                // navigation("/login/publisher")
              }}
              variant="contained"
              sx={{ marginTop: '20px' }}
            >
              更新`
            </Button>
          ) : (
            <Button
              onClick={() => {
                // 登録する処理
                console.log(mangaData);
                // 一旦会社のIDは１固定
                postFormData(mangaData);
                // navigation("/login/publisher")
              }}
              variant="contained"
              sx={{ marginTop: '20px' }}
            >
              登録
            </Button>
          )}
        </Container>
      </Container>
    </>
  );
};

export default RegisterAndEditMangaPage;
