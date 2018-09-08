async function wait(time) {
    return new Promise((resolve) => { resolve(); }, time);
}


export async function foo(): Promise<boolean> {
    await 2000 |> wait;
    return true;
}

export async function bar(): Promise<string> {
    await 2000 |> wait;
    return 'done';
}