import Head from 'next/head';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { Field, PublicKey, Mina, fetchAccount } from 'o1js';
import { Add } from 'testing_adding_number/build/src/contract/Add';

const inter = Inter({ subsets: ['latin'] });

async function timeout(seconds: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    });
}

export default function Home() {
    const [state, setState] = useState({
        hasWallet: null as null | boolean,
        hasBeenSetup: false,
        accountExists: false,
        currentNum: null as null | Field,
        publicKey: null as null | PublicKey,
        zkappPublicKey: null as null | PublicKey,
        creatingTransaction: false,
        zkApp: null as null | Add,
    });
    const [displayText, setDisplayText] = useState('');
    const [transactionlink, setTransactionLink] = useState('');
    const [statusAddOne, setStatusAddOne] = useState<string>('...');

    async function addToNum() {
        setStatusAddOne('Loading...');
        try {
            if (state.publicKey) {
                const sender = state.publicKey;
                if (state.zkApp) {
                    await fetchAccount({ publicKey: sender });

                    setStatusAddOne('Creating transaction...');
                    const tx = await Mina.transaction(sender, () => {
                        state.zkApp!.addNumber(new Field(1));
                    });

                    setStatusAddOne('Create done. Proving tx...');
                    await tx.prove();

                    const transactionJSON = tx.toJSON();
                    console.log(transactionJSON);

                    let transactionFee = 0.1;

                    setStatusAddOne('Sending transaction...');
                    const { hash } = await window.mina!.sendTransaction({
                        transaction: transactionJSON,
                        feePayer: {
                            fee: transactionFee,
                            memo: '',
                        },
                    });

                    const transactionLink = `https://berkeley.minaexplorer.com/transaction/${hash}`;
                    console.log(transactionLink);
                }
            }
        } catch (err) {
            console.log(err);
        }
        setStatusAddOne('...');
    }

    useEffect(() => {
        async function timeout(seconds: number): Promise<void> {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, seconds * 1000);
            });
        }

        (async () => {
            if (!state.hasBeenSetup) {
                setDisplayText('Loading web worker...');
                console.log('Loading web worker...');

                await timeout(5);
                const Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');
                console.log('Berkeley Instance Created');
                Mina.setActiveInstance(Berkeley);

                setDisplayText('Done loading web worker');
                console.log('Done loading web worker');

                const mina = (window as any).mina;

                if (mina == null) {
                    setState({ ...state, hasWallet: false });
                    return;
                }

                const publicKeyBase58: string = (await mina.requestAccounts())[0];
                const publicKey = PublicKey.fromBase58(publicKeyBase58);

                console.log(`Using key:${publicKey.toBase58()}`);
                setDisplayText(`Using key:${publicKey.toBase58()}`);

                setDisplayText('Checking if fee payer account exists...');
                console.log('Checking if fee payer account exists...');

                const res = await fetchAccount({ publicKey });

                const accountExists = res.error == null;

                // const { Add } = await import('testing_adding_number/build/src/contract/Add');

                console.log('Compiling zkApp...');
                setDisplayText('Compiling zkApp...');
                await Add.compile();
                console.log('zkApp compiled');
                setDisplayText('zkApp compiled...');

                const zkappPublicKey = PublicKey.fromBase58('B62qrhWzYXdEHzH1xaHoNG3BP2Gr4hs4RGDo7gpyDMWTUYeiiUPErQb');

                const zkapp = new Add!(zkappPublicKey);

                console.log('Getting zkApp state...');
                setDisplayText('Getting zkApp state...');

                await fetchAccount({ publicKey: zkappPublicKey });
                const currentNum = await zkapp.num.get();
                console.log(`Current state in zkApp: ${currentNum.toString()}`);
                setDisplayText('');

                setState({
                    ...state,
                    hasWallet: true,
                    hasBeenSetup: true,
                    publicKey,
                    zkappPublicKey,
                    accountExists,
                    currentNum,
                    zkApp: zkapp,
                });
            }
        })();
    }, []);

    let hasWallet;
    if (state.hasWallet != null && !state.hasWallet) {
        const auroLink = 'https://www.aurowallet.com/';
        const auroLinkElem = (
            <a href={auroLink} target="_blank" rel="noreferrer">
                Install Auro wallet here
            </a>
        );
        hasWallet = <div>Could not find a wallet. {auroLinkElem}</div>;
    }

    const stepDisplay = transactionlink ? (
        <a href={displayText} target="_blank" rel="noreferrer">
            View transaction
        </a>
    ) : (
        displayText
    );

    let setup = (
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', paddingBottom: '5rem' }}>
            {stepDisplay}
            {hasWallet}
        </div>
    );

    let accountDoesNotExist;
    if (state.hasBeenSetup && !state.accountExists) {
        const faucetLink = 'https://faucet.minaprotocol.com/?address=' + state.publicKey!.toBase58();
        accountDoesNotExist = (
            <div>
                Account does not exist.
                <a href={faucetLink} target="_blank" rel="noreferrer">
                    Visit the faucet to fund this fee payer account
                </a>
            </div>
        );
    }

    let mainContent;
    if (state.hasBeenSetup && state.accountExists) {
        mainContent = (
            <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ padding: 0 }}>Current state in zkApp: {state.currentNum!.toString()} </div>
                <button onClick={addToNum} disabled={state.creatingTransaction}>
                    Send Transaction | {statusAddOne}
                </button>
                <button>Get Latest State</button>
            </div>
        );
    }
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={`${inter.className}`}>
                {setup}
                {accountDoesNotExist}
                {mainContent}
            </main>
        </>
    );
}
