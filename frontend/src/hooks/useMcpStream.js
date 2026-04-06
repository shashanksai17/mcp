import { useEffect, useRef } from "react";
import { getWsUrl } from "../services/mcpClient";

export function useMcpStream({ token, symbols, onMessage }) {
  const reconnectRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return undefined;

    let isUnmounted = false;

    const connect = () => {
      const ws = new WebSocket(getWsUrl(token));
      socketRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "subscribe", symbols }));
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          onMessage?.(payload);
        } catch {
          // noop
        }
      };

      ws.onclose = () => {
        if (isUnmounted) return;
        reconnectRef.current = setTimeout(connect, 2000);
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (socketRef.current && socketRef.current.readyState <= 1) {
        socketRef.current.close();
      }
    };
  }, [token, symbols, onMessage]);
}
