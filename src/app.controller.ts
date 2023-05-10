import { Body, Controller, Get, Post, Render,Req, Res, UseGuards  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Octokit } from '@octokit/rest';
import { userData } from './models/user.interface';
import { UsersService } from './services/users.service';


interface CustomRequest extends Request {
  user: userData
}
@Controller()
export class AppController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Render('index')
  index() {
    return { title: "True Foundry's GitHub Authorizer" };
  }

  @Get('/auth/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // The user will be redirected to GitHub to authorize the application.
  }

  @Get('/auth/github/callback')
  @UseGuards(AuthGuard('github'))
  @Render('index')
  async githubAuthCallback(@Req() req: CustomRequest) {
    const {user} = req
    const users = await this.userService.getUsers();
    const data = await this.userService.createUser(user)
    
    // Create a JSON string from the data
    const jsonString = JSON.stringify(users);

    // Create a new file in the repository with the JSON data
    // The user has authorized the application and we have access to their profile and access token.
    const { accessToken } = user;
    

    const octokit = new Octokit({
      auth: accessToken,
    });
    // Create a new repository for the user
    const repoName = 'True-Foundry';
    const repoDescription = "Random Star wars reference";
    try {
      await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: repoDescription,
        private: false,
        auto_init: true, // Initialize the repository with a README.md file
      });
      await octokit.repos.createOrUpdateFileContents({
        owner: user.username,
        repo: repoName,
        path: 'users.json',
        message: 'A Json file containing all the users in the sqlite database and "the force!!" ',
        content: Buffer.from(jsonString).toString('base64'),
      });
    } catch (err) {
      console.error(`Error creating repository: ${err.message}`);
      console.error(`Status code: ${err.status}`);
    }

    return { title: "True Foundry's GitHub Authorizer" , message: 'The Auth worked!!' };
  }

}
