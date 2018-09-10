import io from 'socket.io-client';
import  { url_api } from './constants';

export const socket = io.connect(url_api);
