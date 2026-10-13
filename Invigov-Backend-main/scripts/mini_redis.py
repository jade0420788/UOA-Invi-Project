"""Minimal Redis RESP server for local development (PING/INFO)."""
from __future__ import annotations

import socket
import threading

HOST = "127.0.0.1"
PORT = 6379


def _read_command(conn: socket.socket) -> list[bytes] | None:
    data = b""
    while True:
        chunk = conn.recv(4096)
        if not chunk:
            return None
        data += chunk
        if b"\r\n" in data:
            break
        if len(data) > 65536:
            return None

    # Inline command: PING\r\n
    if not data.startswith(b"*"):
        line = data.split(b"\r\n", 1)[0]
        return [line.strip()]

    # Array: *1\r\n$4\r\nPING\r\n
    try:
        lines = data.split(b"\r\n")
        count = int(lines[0][1:])
        args: list[bytes] = []
        i = 1
        while len(args) < count and i < len(lines):
            if not lines[i].startswith(b"$"):
                i += 1
                continue
            i += 1
            if i >= len(lines):
                break
            args.append(lines[i])
            i += 1
        return args
    except Exception:
        return [b"PING"] if b"PING" in data.upper() else None


def handle(conn: socket.socket) -> None:
    try:
        while True:
            args = _read_command(conn)
            if args is None:
                break
            cmd = (args[0] if args else b"").decode("utf-8", errors="ignore").upper()
            if cmd == "PING":
                conn.sendall(b"+PONG\r\n")
            elif cmd == "INFO":
                body = b"# Server\r\nredis_version:7.0.0\r\n"
                conn.sendall(f"${len(body)}\r\n".encode() + body + b"\r\n")
            elif cmd in {"SELECT", "CLIENT", "HELLO", "COMMAND"}:
                conn.sendall(b"+OK\r\n")
            elif cmd == "QUIT":
                conn.sendall(b"+OK\r\n")
                break
            else:
                conn.sendall(b"+OK\r\n")
    except OSError:
        pass
    finally:
        try:
            conn.close()
        except OSError:
            pass


def main() -> None:
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind((HOST, PORT))
    srv.listen(50)
    print(f"mini-redis listening on {HOST}:{PORT}", flush=True)
    while True:
        conn, _ = srv.accept()
        threading.Thread(target=handle, args=(conn,), daemon=True).start()


if __name__ == "__main__":
    main()
