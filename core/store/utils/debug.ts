import chalk from 'chalk';

class Debug {
    // Utilizamos captureStackTrace para mejorar la calidad de la pila en funciones async
    static captureStack() {
        const stack = new Error().stack || '';
        const stackLines = stack.split('\n');

        // Aseguramos que siempre se capture la línea y el archivo relevante
        return stackLines.length > 2
            ? stackLines[2].trim()
            : 'No stack trace available';
    }

    static getDate() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const miliseconds = now.getMilliseconds();
        return chalk.bold(
            chalk.gray(`${hours}:${minutes}:${seconds}:${miliseconds}`),
        );
    }

    static async Error(data: any): Promise<void> {
        console.log(`[${chalk.red('ERROR')}] ${this.getDate()} ${data}`);
    }

    static async Log(data: any): Promise<void> {
        console.log(`[${chalk.yellow('LOG')}] ${this.getDate()} ${data}`);
    }

    static async Info(data: any): Promise<void> {
        console.log(`[${chalk.cyan('INFO')}] ${this.getDate()} ${data}`);
    }

    static async Success(data: any): Promise<void> {
        console.log(`[${chalk.green('SUCCESS')}] ${this.getDate()} ${data}`);
    }

    static async HTTP(
        method: string,
        data: any,
        statusCode: number | undefined,
    ): Promise<void> {
        console.log(
            `[${chalk.magenta(method)}] ${this.getDate()} ${data} ${statusCode ?? ''}`,
        );
    }
}