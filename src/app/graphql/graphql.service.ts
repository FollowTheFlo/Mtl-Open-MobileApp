import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { FetchResult } from 'apollo-link';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  resetStore() {
    console.log('apollo resetStore');
    return this.apollo.getClient().resetStore();
  }

  login(email: string, password: string): Observable<ApolloQueryResult<any>> {
    console.log('apollo getplayers: ');
    // tslint:disable-next-line: no-unused-expression
    return this.apollo.query<any>({
      query: gql`
              query {
                login (
                  email:"${email}"
                  password: "${password}"

                ) {
                  userId
                  token
                  username
                  expiresIn
                }
              },
            `,
    });
  }

  signup(
    userName: string,
    email: string,
    password: string,
  ): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return this.apollo.mutate<any>({
      mutation: gql`
      mutation {
        createUser(userInput:
        {
          email: "${email}",
          password:"${password}",
          name:"${userName}"
        }
          ) {
            name
            email
            _id

          }
        }

      `,
    });
  }

  resetPassword(email: string): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return this.apollo.mutate<any>({
      mutation: gql`
      mutation {
        resetPassword(
           email: "${email}"
          )
        }
      `,
    });
  }

  facebookSignIn(code: string): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return this.apollo.mutate<any>({
      mutation: gql`
    mutation {
      facebookSignIn(code: "${code}")
    }
  `,
    });
  }

  checkPasswordToken(token: string): Observable<ApolloQueryResult<any>> {
    console.log('apollo getplayers: ');
    // tslint:disable-next-line: no-unused-expression
    return this.apollo.query<any>({
      query: gql`
              query {
                checkPasswordToken (
                  token:"${token}"
                ) {
                  success
                  userId
                }
              },
            `,
    });
  }

  updatePassword(
    token: string,
    userId: string,
    password: string,
  ): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    console.log('apollo updatePassword ');
    // tslint:disable-next-line: no-unused-expression
    return this.apollo.mutate<any>({
      mutation: gql`
                mutation {
                  updatePassword (
                    token:"${token}",
                    userId:"${userId}",
                    password:"${password}"
                  )
                },
              `,
    });
  }

  payWithCard(amount: number, token: string): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation {
          payWithCard(
            amount:${amount}
            token: "${token}"
            )
            {
              success
              message
            }
          }
        `,
    });
  }

  getUserInfo(): Observable<ApolloQueryResult<any>> {
    console.log('apollo getUserInfo: ');
    // tslint:disable-next-line: no-unused-expression
    return this.apollo.query<any>({
      query: gql`
        query {
          getUserInfo {
            _id
            name
            email
            role
          }
        }
      `,
    });
  }

  getplayers(): Observable<ApolloQueryResult<any>> {
    console.log('apollo getplayers: ');
    // tslint:disable-next-line: no-unused-expression
    return this.apollo.query<any>({
      query: gql`
        query {
          getUserPlayers {
            players {
              _id
              firstName
              lastName
              ranking
              email
              dob
            }
          }
        }
      `,
    });
  }

  createPlayer(
    firstName: string,
    lastName: string,
    email: string,
    ranking: number,
  ): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return this.apollo.mutate<any>({
      mutation: gql`
      mutation {
        createPlayer(playerInput:
        {
          firstName:"${firstName}"
          lastName: "${lastName}"
          email: "${email}"
          ranking: ${ranking}
          club: "Pekin"
          country: "China"
          dob: "1989-06-06",
          gender: "male"
        }
          ) {
          _id
          firstName
          lastName
          email
          createdAt
          updatedAt

          }
        }
      `,
    });
  }

  getRegistrations(): Observable<ApolloQueryResult<any>> {
    return this.apollo.query<any>({
      query: gql`
        query {
          getUserRegistrations {
            registrations {
              tournament {
                _id
                index
                title
                price
                day
              }
              player {
                _id
                firstName
                lastName
                email
                ranking
              }
              invoice {
                _id
                hasPayed
              }
              canceled
              canceledDate
              price
              createdAt
              updatedAt
              hasPayed
              paymentType
            }
          }
        }
      `,
    });
  }

  getAllRegistrations(): Observable<ApolloQueryResult<any>> {
    return this.apollo.query<any>({
      query: gql`
        query {
          adminGetTournamentRegistrations {
            registrations {
              tournament {
                _id
                index
                title
                price
                day
              }
              player {
                _id
                firstName
                lastName
                email
                ranking
              }
              invoice {
                _id
                hasPayed
              }
              canceled
              canceledDate
              price
              createdAt
              updatedAt
              hasPayed
              paymentType
              _id
            }
          }
        }
      `,
    });
  }

  registerPlayer(
    invoiceId: string,
    playerId: string,
    tournamentId: string,
    hasPayed: boolean,
    paymentType: string,
  ): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        addPlayerToTournament(
          invoiceId: "${invoiceId}"
          playerId: "${playerId}"
          tournamentId: "${tournamentId}"
          hasPayed: ${hasPayed}
          paymentType: "${paymentType}"

    ) {
    success
    message
    error
  }

  }`,
    });
  }

  confirmPayment(regId: string): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return this.apollo.mutate({
      mutation: gql`
    mutation {
      confirmPayment(
        regId:"${regId}")

    }`,
    });
  }

  confirmInvoicePayment(invoiceId: string): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return this.apollo.mutate({
      mutation: gql`
    mutation {
      confirmInvoicePayment(
        invoiceId:"${invoiceId}")

    }`,
    });
  }

  cancelRegistration(regId: string): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return this.apollo.mutate({
      mutation: gql`
    mutation {
      cancelRegistration(
        regId:"${regId}")

}`,
    });
  }

  cancelInvoice(invId: string): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return this.apollo.mutate({
      mutation: gql`
    mutation {
      cancelInvoice(
        invId:"${invId}")

}`,
    });
  }

  createInvoice(
    hasPayed: boolean,
    totalPrice: number,
    paymentType: string,
  ): Observable<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return this.apollo.mutate({
      mutation: gql`
    mutation {
      createInvoice (
      paymentType:"${paymentType}",
      totalPrice:${totalPrice},
      hasPayed:${hasPayed}
      ) {
        _id

      }

}`,
    });
  }

  getAllInvoices(): Observable<ApolloQueryResult<any>> {
    return this.apollo.query<any>({
      query: gql`
        query {
          getAllInvoices {
            invoices {
              _id
              paymentType
              hasPayed
              totalPrice
              createdAt
              updatedAt
              creator {
                email
              }
            }
          }
        }
      `,
    });
  }

  getUserInvoices(): Observable<ApolloQueryResult<any>> {
    return this.apollo.query<any>({
      query: gql`
        query {
          getUserInvoices {
            invoices {
              _id
              paymentType
              hasPayed
              totalPrice
              createdAt
              updatedAt
              canceled
            }
          }
        }
      `,
    });
  }

  getTournaments(): Observable<ApolloQueryResult<any>> {
    return this.apollo.query<any>({
      query: gql`
        query {
          getTournaments {
            tournaments {
              _id
              index
              title
              price
              registrationsCount
              isFull
              maxPlayers
              day
              reward
              startTime
            }
          }
        }
      `,
    });
  }
  getHistory(entity: string, entityId: string): Observable<ApolloQueryResult<any>> {
    return this.apollo.query<any>({
      query: gql`
          query {
            getHistory(entity:"${entity}",entityId:"${entityId}"){
              historys {
                user {
                  email
                }
                action
                createdAt
              }
          }
        }
        `,
    });
  }
}
