// import { useState, useEffect } from 'react';

// /**
//  * 自定义Hook用于处理API请求
//  * @param apiFunction API请求函数
//  * @returns 请求状态和数据
//  */
// export function useApi<T>(apiFunction: () => Promise<T>) {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const result = await apiFunction();
//         if (isMounted) {
//           setData(result);
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError(err as Error);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, [apiFunction]);

//   return { data, loading, error };
// }

// /**
//  * 自定义Hook用于处理带参数的API请求
//  * @param apiFunction API请求函数
//  * @param params 请求参数
//  * @returns 请求状态和数据
//  */
// export function useApiWithParams<T, P extends any[]>(
//   apiFunction: (...params: P) => Promise<T>,
//   params: P
// ) {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const result = await apiFunction(...params);
//         if (isMounted) {
//           setData(result);
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError(err as Error);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, [apiFunction, ...params]);

//   return { data, loading, error };
// }
