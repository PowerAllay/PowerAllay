import assert from 'assert';

export default class BinaryStream {
    private binary: Array<number> = [];
    private readonly buffer: Buffer | null = null;
    private readIndex: number;
    private writeIndex = 0;

    /**
     * Creates a new BinaryStream instance.
     * @param {Buffer|null|undefined} buffer - The array or Buffer containing binary data.
     * @param {number} offset - The initial pointer position.
     */
    public constructor(buffer?: Buffer, offset: number = 0) {
        this.buffer = buffer ?? null; // Keep this instance for reading
        this.readIndex = offset;
    }

    /**
     * Reads a slice of buffer by the given length.
     * @param {number} len
     */
    public read(len: number): Buffer {
        this.doReadAssertions(len);
        return this.buffer!.slice(this.readIndex, (this.readIndex += len));
    }

    /**
     * Appends a buffer to the main buffer.
     * @param {Buffer|Uint8Array} buf
     */
    public write(buf: Uint8Array): void;
    public write(buf: Buffer): void {
        this.binary = [...this.binary, ...buf];
        this.writeIndex += buf.byteLength;
    }

    /**
     * Reads an unsigned byte (0 to 255).
     * @returns {number}
     */
    public readByte(): number {
        this.doReadAssertions(1);
        return this.buffer!.readUInt8(this.readIndex++);
    }

    /**
     * Writes an unsigned byte (0 to 255).
     * @param {number} v
     */
    public writeByte(v: number): void {
        v &= 0xff;
        this.binary[this.writeIndex++] = v;
    }

    /**
     * Reads a signed byte (-128 to 127).
     * @returns {number}
     */
    public readSignedByte(): number {
        this.doReadAssertions(1);
        return this.buffer!.readInt8(this.readIndex++);
    }

    /**
     * Writes a signed byte (-128 to 127).
     * @param {number} v
     */
    public writeSignedByte(v: number): void {
        if (v < 0) v = 0xff + v + 1;
        this.binary[this.writeIndex++] = v & 0xff;
    }

    /**
     * Reads a boolean (true or false).
     * @returns {boolean}
     */
    public readBoolean(): boolean {
        this.doReadAssertions(1);
        return !!this.readByte();
    }

    /**
     * Writes a boolean (true or false).
     * @param {boolean} v
     */
    public writeBoolean(v: boolean): void {
        this.writeByte(+v);
    }

    /**
     * Reads a 16 bit (2 bytes) signed big-endian number.
     * @returns {number}
     */
    public readShort(): number {
        this.doReadAssertions(2);
        return this.buffer!.readInt16BE(this.addOffset(2));
    }

    /**
     * Writes a 16 bit (2 bytes) signed big-endian number.
     * @param {number} v
     */
    public writeShort(v: number): void {
        this.doWriteAssertions(v, -32_768, 32_767);
        this.writeByte(v >> 8);
        this.writeByte(v);
    }

    /**
     * Reads a 16 bit (2 bytes) signed little-endian number.
     * @returns {number}
     */
    public readShortLE(): number {
        this.doReadAssertions(2);
        return this.buffer!.readInt16LE(this.addOffset(2));
    }

    /**
     * Writes a 16 bit (2 bytes) signed big-endian number.
     * @param {number} v
     */
    public writeShortLE(v: number): void {
        this.doWriteAssertions(v, -32_768, 32_767);
        this.writeByte(v);
        this.writeByte(v >> 8);
    }

    /**
     * Reads a 16 bit (2 bytes) unsigned big-endian number.
     * @returns {number}
     */
    public readUnsignedShort(): number {
        this.doReadAssertions(2);
        return this.buffer!.readUInt16BE(this.addOffset(2));
    }

    /**
     * Writes a 16 bit (2 bytes) unsigned big-endian number.
     * @param {number} v
     */
    public writeUnsignedShort(v: number): void {
        this.doWriteAssertions(v, 0, 65_535);
        this.writeByte(v >>> 8);
        this.writeByte(v);
    }

    /**
     * Reads a 16 bit (2 bytes) unsigned little-endian number.
     * @returns {number}
     */
    public readUnsignedShortLE(): number {
        this.doReadAssertions(2);
        return this.buffer!.readUInt16LE(this.addOffset(2));
    }

    /**
     * Writes a 16 bit (2 bytes) unsigned little-endian number.
     * @param {number} v
     */
    public writeUnsignedShortLE(v: number): void {
        this.doWriteAssertions(v, 0, 65_535);
        this.writeByte(v);
        this.writeByte(v >>> 8);
    }

    /**
     * Reads a 24 bit (3 bytes) signed big-endian number.
     * @returns {number}
     */
    public readTriad(): number {
        this.doReadAssertions(3);
        return this.buffer!.readIntBE(this.addOffset(3), 3);
    }

    /**
     * Writes a 24 bit (3 bytes) signed big-endian number.
     * @param {number} v
     */
    public writeTriad(v: number): void {
        this.doWriteAssertions(v, -8_388_608, 8_388_607);
        this.writeByte((v & 0xff0000) >> 16); // msb
        this.writeByte((v & 0x00ff00) >> 8); // mib
        this.writeByte(v & 0x0000ff); // lsb
    }

    /**
     * Reads a 24 bit (3 bytes) little-endian number.
     * @returns {number}
     */
    public readTriadLE(): number {
        this.doReadAssertions(3);
        return this.buffer!.readIntLE(this.addOffset(3), 3);
    }

    /**
     * Writes a 24 bit (3 bytes) signed little-endian number.
     * @param {number} v
     */
    public writeTriadLE(v: number): void {
        this.doWriteAssertions(v, -8_388_608, 8_388_607);
        this.writeByte(v & 0x0000ff);
        this.writeByte((v & 0x00ff00) >> 8);
        this.writeByte((v & 0xff0000) >> 16);
    }

    /**
     * Reads a 24 bit (3 bytes) unsigned big-endian number.
     * @returns {number}
     */
    public readUnsignedTriad(): number {
        this.doReadAssertions(3);
        return this.buffer!.readUIntBE(this.addOffset(3), 3);
    }

    /**
     * Writes a 24 bit (3 bytes) unsigned big-endian number.
     * @param {number} v
     */
    public writeUnsignedTriad(v: number): void {
        this.doWriteAssertions(v, 0, 16_777_215);
        this.writeByte((v & 0xff0000) >>> 16); // msb
        this.writeByte((v & 0x00ff00) >>> 8); // mib
        this.writeByte(v & 0x0000ff); // lsb
    }

    /**
     * Reads a 24 bit (3 bytes) unsigned little-endian number.
     * @returns {number}
     */
    public readUnsignedTriadLE(): number {
        this.doReadAssertions(3);
        return this.buffer!.readUIntLE(this.addOffset(3), 3);
    }

    /**
     * Writes a 24 bit (3 bytes) unsigned little-endian number.
     * @param {number} v
     */
    public writeUnsignedTriadLE(v: number): void {
        this.doWriteAssertions(v, 0, 16_777_215);
        this.writeByte(v & 0x0000ff);
        this.writeByte((v & 0x00ff00) >>> 8);
        this.writeByte((v & 0xff0000) >>> 16);
    }

    /**
     * Reads a 32 bit (4 bytes) big-endian signed number.
     * @returns {number}
     */
    public readInt(): number {
        this.doReadAssertions(4);
        return this.buffer!.readInt32BE(this.addOffset(4));
    }

    /**
     * Writes a 32 bit (4 bytes) big-endian signed number.
     * @param {number} v
     */
    public writeInt(v: number): void {
        if (v < 0) v = v & (0xffffffff + v + 1);
        this.doWriteAssertions(v, -2_147_483_648, 2_147_483_647);
        this.writeByte(v >> 24);
        this.writeByte(v >> 16);
        this.writeByte(v >> 8);
        this.writeByte(v);
    }

    /**
     * Reads a 32 bit (4 bytes) signed number.
     * @returns {number}
     */
    public readIntLE(): number {
        this.doReadAssertions(4);
        return this.buffer!.readIntLE(this.addOffset(4), 4);
    }

    /**
     * Writes a 32 bit (4 bytes) little-endian signed number.
     * @param {number} v
     */
    public writeIntLE(v: number) {
        if (v < 0) v = v & (0xffffffff + v + 1);
        this.doWriteAssertions(v, -2_147_483_648, 2_147_483_647);
        this.writeByte(v);
        this.writeByte(v >> 8);
        this.writeByte(v >> 16);
        this.writeByte(v >> 24);
    }

    /**
     * Reads a 32 bit (4 bytes) big-endian unsigned number.
     * @returns {number}
     */
    public readUnsignedInt(): number {
        this.doReadAssertions(4);
        return this.buffer!.readUInt32BE(this.addOffset(4));
    }

    /**
     * Writes a 32 bit (4 bytes) big-endian unsigned number.
     * @param {number} v
     */
    public writeUnsignedInt(v: number): void {
        this.doWriteAssertions(v, 0, 4_294_967_295);
        this.writeByte(v >>> 24);
        this.writeByte(v >>> 16);
        this.writeByte(v >>> 8);
        this.writeByte(v);
    }

    /**
     * Reads a 32 bit (4 bytes) little-endian unsigned number.
     * @returns {number}
     */
    public readUnsignedIntLE(): number {
        this.doReadAssertions(4);
        return this.buffer!.readUInt32LE(this.addOffset(4));
    }

    /**
     * Writes a 32 bit (4 bytes) little-endian unsigned number.
     * @param {number} v
     */
    public writeUnsignedIntLE(v: number): void {
        this.doWriteAssertions(v, 0, 4_294_967_295);
        this.writeByte(v);
        this.writeByte(v >>> 8);
        this.writeByte(v >>> 16);
        this.writeByte(v >>> 24);
    }

    /**
     * Returns a 32 bit (4 bytes) big-endian flating point number.
     * @returns {number}
     */
    public readFloat(): number {
        this.doReadAssertions(4);
        return this.buffer!.readFloatBE(this.addOffset(4));
    }

    /**
     * Writes a 32 bit (4 bytes) big-endian floating point number.
     * @param {number} v
     */
    public writeFloat(v: number): void {
        this.doWriteAssertions(v, -3.4028234663852886e38, +3.4028234663852886e38);
        this.write(new Uint8Array(new Float32Array([v]).buffer).reverse());
    }

    /**
     * Returns a 32 bit (4 bytes) big-endian flating point number.
     * @returns {number}
     */
    public readFloatLE(): number {
        this.doReadAssertions(4);
        return this.buffer!.readFloatLE(this.addOffset(4));
    }

    /**
     * Writes a 32 bit (4 bytes) little-endian floating point number.
     * @param {number} v
     */
    public writeFloatLE(v: number): void {
        this.doWriteAssertions(v, -3.4028234663852886e38, +3.4028234663852886e38);
        this.write(new Uint8Array(new Float32Array([v]).buffer));
    }

    /**
     * Returns a 64 bit (8 bytes) big-endian flating point number.
     * @returns {number}
     */
    public readDouble(): number {
        this.doReadAssertions(8);
        return this.buffer!.readDoubleBE(this.addOffset(8));
    }

    /**
     * Writes a 64 bit (8 bytes) big-endian floating point number.
     * @param {number} v
     */
    public writeDouble(v: number): void {
        this.doWriteAssertions(v, -1.7976931348623157e308, +1.7976931348623157e308);
        this.write(new Uint8Array(new Float64Array([v]).buffer).reverse());
    }

    /**
     * Returns a 64 bit (8 bytes) little-endian flating point number.
     * @returns {number}
     */
    public readDoubleLE(): number {
        this.doReadAssertions(8);
        return this.buffer!.readDoubleLE(this.addOffset(8));
    }

    /**
     * Writes a 64 bit (8 bytes) little-endian floating point number.
     * @param {number} v
     */
    public writeDoubleLE(v: number): void {
        this.doWriteAssertions(v, -1.7976931348623157e308, +1.7976931348623157e308);
        this.write(new Uint8Array(new Float64Array([v]).buffer));
    }

    /**
     * Returns a 64 bit (8 bytes) signed big-endian number.
     * @returns {bigint}
     */
    public readLong(): bigint {
        this.doReadAssertions(8);
        return this.buffer!.readBigInt64BE(this.addOffset(8));
    }

    /**
     * Writes a 64 bit (8 bytes) signed big-endian number.
     * @param {bigint} v
     */
    public writeLong(v: bigint): void {
        const lo = Number(v & BigInt(0xffffffff));
        this.binary[this.writeIndex + 7] = lo;
        this.binary[this.writeIndex + 6] = lo >> 8;
        this.binary[this.writeIndex + 5] = lo >> 16;
        this.binary[this.writeIndex + 4] = lo >> 24;
        const hi = Number((v >> BigInt(32)) & BigInt(0xffffffff));
        this.binary[this.writeIndex + 3] = hi;
        this.binary[this.writeIndex + 2] = hi >> 8;
        this.binary[this.writeIndex + 1] = hi >> 16;
        this.binary[this.writeIndex] = hi >> 24;
        this.writeIndex += 8;
    }

    /**
     * Returns a 64 bit (8 bytes) signed little-endian number.
     * @returns {bigint}
     */
    public readLongLE(): bigint {
        this.doReadAssertions(8);
        return this.buffer!.readBigInt64LE(this.addOffset(8));
    }

    /**
     * Writes a 64 bit (8 bytes) signed big-endian number.
     * @param {bigint} v
     */
    public writeLongLE(v: bigint): void {
        const lo = Number(v & BigInt(0xffffffff));
        this.binary[this.writeIndex++] = lo;
        this.binary[this.writeIndex++] = lo >> 8;
        this.binary[this.writeIndex++] = lo >> 16;
        this.binary[this.writeIndex++] = lo >> 24;
        const hi = Number((v >> BigInt(32)) & BigInt(0xffffffff));
        this.binary[this.writeIndex++] = hi;
        this.binary[this.writeIndex++] = hi >> 8;
        this.binary[this.writeIndex++] = hi >> 16;
        this.binary[this.writeIndex++] = hi >> 24;
    }

    /**
     * Returns a 64 bit (8 bytes) unsigned big-endian number.
     * @returns {bigint}
     */
    public readUnsignedLong(): bigint {
        this.doReadAssertions(8);
        return this.buffer!.readBigUInt64BE(this.addOffset(8));
    }

    /**
     * Writes a 64 bit (8 bytes) unsigned big-endian number.
     * @param {bigint} v
     */
    public writeUnsignedLong(v: bigint): void {
        const lo = Number(v & BigInt(0xffffffff));
        this.binary[this.writeIndex + 7] = lo;
        this.binary[this.writeIndex + 6] = lo >> 8;
        this.binary[this.writeIndex + 5] = lo >> 16;
        this.binary[this.writeIndex + 4] = lo >> 24;
        const hi = Number((v >> BigInt(32)) & BigInt(0xffffffff));
        this.binary[this.writeIndex + 3] = hi;
        this.binary[this.writeIndex + 2] = hi >> 8;
        this.binary[this.writeIndex + 1] = hi >> 16;
        this.binary[this.writeIndex] = hi >> 24;
        this.writeIndex += 8;
    }

    /**
     * Returns a 64 bit (8 bytes) unsigned little-endian number.
     * @returns {bigint}
     */
    public readUnsignedLongLE(): bigint {
        this.doReadAssertions(8);
        return this.buffer!.readBigUInt64LE(this.addOffset(8));
    }

    /**
     * Writes a 64 bit (8 bytes) unsigned big-endian number.
     * @param {bigint} v
     */
    public writeUnsignedLongLE(v: bigint): void {
        const lo = Number(v & BigInt(0xffffffff));
        this.binary[this.writeIndex++] = lo;
        this.binary[this.writeIndex++] = lo >> 8;
        this.binary[this.writeIndex++] = lo >> 16;
        this.binary[this.writeIndex++] = lo >> 24;
        const hi = Number((v >> BigInt(32)) & BigInt(0xffffffff));
        this.binary[this.writeIndex++] = hi;
        this.binary[this.writeIndex++] = hi >> 8;
        this.binary[this.writeIndex++] = hi >> 16;
        this.binary[this.writeIndex++] = hi >> 24;
    }

    /**
     * Reads a 32 bit (4 bytes) zigzag-encoded number.
     * @returns {number}
     */
    public readVarInt(): number {
        const raw = this.readUnsignedVarInt();
        const temp = (((raw << 63) >> 63) ^ raw) >> 1;
        return temp ^ (raw & (1 << 63));
    }

    /**
     * Writes a 32 bit (4 bytes) zigzag-encoded number.
     * @param {number} v
     */
    public writeVarInt(v: number): void {
        v = (v << 0) >> 0;
        return this.writeUnsignedVarInt((v << 1) ^ (v >> 31));
    }

    /**
     * Reads a 32-bit unsigned number.
     * @returns {number}
     */
    public readUnsignedVarInt(): number {
        assert(this.buffer != null, 'Reading on empty buffer!');
        let value = 0;
        for (let i = 0; i <= 28; i += 7) {
            if (typeof this.buffer![this.readIndex] === 'undefined') {
                throw new Error('No bytes left in buffer');
            }
            let b = this.readByte();
            value |= (b & 0x7f) << i;

            if ((b & 0x80) === 0) {
                return value;
            }
        }

        throw new Error('VarInt did not terminate after 5 bytes!');
    }

    /**
     * Writes a 32-bit unsigned number with variable-length.
     * @param {number} v
     */
    public writeUnsignedVarInt(v: number): void {
        while ((v & 0xffffff80) !== 0) {
            this.writeByte((v & 0x7f) | 0x80);
            v >>>= 7;
        }
        this.writeByte(v & 0x7f);
    }

    /**
     * Reads a 64 bit zigzag-encoded variable-length number.
     * @returns {bigint}
     */
    public readVarLong(): bigint {
        const raw = this.readUnsignedVarLong();
        return raw >> 1n;
    }

    /**
     * Writes a 64 bit unsigned zigzag-encoded number.
     * @param {bigint} v
     */
    public writeVarLong(v: bigint) {
        return this.writeUnsignedVarLong((v << 1n) ^ (v >> 63n));
    }

    /**
     * Reads a 64 bit unsigned variable-length number.
     * @returns {bigint}
     */
    public readUnsignedVarLong(): bigint {
        let value = 0n;
        for (let i = 0; i <= 63; i += 7) {
            if (this.feof()) {
                throw new Error('No bytes left in buffer');
            }
            const b = this.readByte();
            value |= (BigInt(b) & 0x7fn) << BigInt(i);

            if ((b & 0x80) === 0) {
                return value;
            }
        }

        throw new Error('VarLong did not terminate after 10 bytes!');
    }

    /**
     * Writes a 64 bit unsigned variable-length number.
     * @param {bigint} v
     */
    public writeUnsignedVarLong(v: bigint) {
        for (let i = 0; i < 10; ++i) {
            if (v >> 7n !== 0n) {
                this.writeByte(Number(v | 0x80n));
            } else {
                this.writeByte(Number(v & 0x7fn));
                break;
            }
            v >>= 7n;
        }
    }

    /**
     * Increases the write offset by the given length.
     * @param {number} length
     */
    private addOffset(length: number): number {
        return (this.readIndex += length) - length;
    }

    /**
     * Returns whatever or not the read offset is at end of line.
     * @returns {number}
     */
    public feof(): boolean {
        if (!this.buffer) throw new Error('Buffer is write only!');
        return typeof this.buffer[this.readIndex] === 'undefined';
    }

    /**
     * Reads the remaining bytes and returns the buffer slice.
     * @returns {Buffer}
     */
    public readRemaining(): Buffer {
        if (!this.buffer) throw new Error('Buffer is write only!');
        const buf = this.buffer!.slice(this.readIndex);
        this.readIndex = this.buffer.byteLength;
        return buf;
    }

    /**
     * Skips len bytes on the buffer.
     * @param {number} len
     */
    public skip(len: number): void {
        assert(Number.isInteger(len), 'Cannot skip a float amount of bytes');
        this.readIndex += len;
    }

    /**
     * Returns the encoded buffer.
     * @returns {Buffer}
     */
    public getBuffer(): Buffer {
        return this.buffer !== null ? this.buffer : Buffer.from(this.binary);
    }

    /**
     * Retuns the read index.
     * @returns {number}
     */
    public getReadIndex(): number {
        return this.readIndex;
    }

    /**
     * Returns the write index.
     * @returns {number}
     */
    public getWriteIndex(): number {
        return this.writeIndex;
    }

    /**
     * Do read assertions, check if the read buffer is null.
     * @param {number} byteLength
     */
    private doReadAssertions(byteLength: number): void {
        assert(this.buffer !== null, 'Cannot read without buffer data!');
        assert(this.buffer.byteLength >= byteLength, 'Cannot read without buffer data!');
    }

    /**
     * Do read assertions, check if the read buffer is null.
     * @param {number|bigint} num
     * @param {number|bigint} minVal
     * @param {number|bigint} maxVal
     */
    private doWriteAssertions(num: number | bigint, minVal: number | bigint, maxVal: number | bigint): void {
        assert(num >= minVal && num <= maxVal, `Value out of bounds: value=${num}, min=${minVal}, max=${maxVal}`);
    }
}
