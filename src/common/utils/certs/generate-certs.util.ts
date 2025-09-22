import {
    cryptoProvider,
    X509CertificateGenerator,
    BasicConstraintsExtension,
    KeyUsagesExtension,
    KeyUsageFlags,
    ExtendedKeyUsageExtension,
    X509Certificate,
} from '@peculiar/x509';
import { Crypto } from '@peculiar/webcrypto';
import { customAlphabet } from 'nanoid';


export async function generateNodeCert(
    caCertPem: string,
    caKeyPem: string,
): Promise<{
    nodeCertPem: string;
    nodeKeyPem: string;
    caCertPem: string;
}> {
    const crypto = new Crypto();
    cryptoProvider.set(crypto);

    const caCert = new X509Certificate(caCertPem);

    const caPrivateKey = await crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(caKeyPem),
        {
            name: 'ECDSA',
            namedCurve: 'P-256',
            hash: { name: 'SHA-256' },
        },
        false,
        ['sign'],
    );

    const nodeKeys = await crypto.subtle.generateKey(
        {
            name: 'ECDSA',
            namedCurve: 'P-256',
            hash: { name: 'SHA-256' },
        },
        true,
        ['sign', 'verify'],
    );

    const nodeCert = await X509CertificateGenerator.create({
        serialNumber: Date.now().toString(),
        subject: `CN=${genRandomString()}`,
        issuer: caCert.subjectName,
        notBefore: new Date(),
        notAfter: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
        publicKey: nodeKeys.publicKey,
        signingKey: caPrivateKey,
        extensions: [
            new BasicConstraintsExtension(false, undefined, true),
            new KeyUsagesExtension(
                KeyUsageFlags.digitalSignature | KeyUsageFlags.keyEncipherment,
                true,
            ),
            new ExtendedKeyUsageExtension(['1.3.6.1.5.5.7.3.1'], true), // serverAuth
        ],
    });

    const nodeCertPem = nodeCert.toString('pem');
    const nodeKeyPem = arrayBufferToPem(
        new Uint8Array(await crypto.subtle.exportKey('pkcs8', nodeKeys.privateKey)),
        'PRIVATE KEY',
    );

    return {
        nodeCertPem,
        nodeKeyPem,
        caCertPem,
    };
}

function arrayBufferToPem(buffer: Uint8Array, label: string): string {
    const b64 = Buffer.from(buffer).toString('base64');
    const formatted = b64.match(/.{1,64}/g)?.join('\n') ?? b64;
    return `-----BEGIN ${label}-----\n${formatted}\n-----END ${label}-----`;
}

function pemToArrayBuffer(pem: string) {
    const b64 = pem
        .replace(/-----BEGIN .* KEY-----/, '')
        .replace(/-----END .* KEY-----/, '')
        .replace(/\s+/g, '');
    return new Uint8Array(Buffer.from(b64, 'base64'));
}

function genRandomString(): string {
    const alphabet = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghjkmnopqrstuvwxyz-';
    const length = Math.floor(Math.random() * 27) + 20;
    const nanoid = customAlphabet(alphabet, length);

    return nanoid();
}
